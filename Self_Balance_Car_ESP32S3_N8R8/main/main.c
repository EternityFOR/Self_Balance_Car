//***Head_Files***
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_wifi.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "cJSON.h"
#include "driver/uart.h"
#include "driver/gpio.h"
#include "ble_t.h"
#include "blufi_app.h"
#include "Data_handle.h"
#include "wifi.h"
#include "main.h"
#include "esp_https_ota.h"
#include "esp_ota_ops.h"

//***Parameters***
//Tags
#define main_tag "main"
#define TAG "OTA"

// WiFi retry times
#define WIFI_CONNECT_RETRY_MAX 5

//UART pin assign
#define TXD_PIN (GPIO_NUM_17)
#define RXD_PIN (GPIO_NUM_18)

//Queue
QueueHandle_t msg_queue = NULL;

//Data type
extern const uint8_t server_cert_pem_start[] asm("_binary_ca_cert_pem_start");
extern const uint8_t server_cert_pem_end[] asm("_binary_ca_cert_pem_end");

//***Functions***

// Initializzation
//uart init
void init_uart() {
    const uart_config_t uart_config = {
        .baud_rate = 115200,
        .data_bits = UART_DATA_8_BITS,
        .parity = UART_PARITY_DISABLE,
        .stop_bits = UART_STOP_BITS_1,
        .flow_ctrl = UART_HW_FLOWCTRL_DISABLE,
    };
    uart_param_config(UART_NUM_1, &uart_config);
    uart_set_pin(UART_NUM_1, TXD_PIN, RXD_PIN, UART_PIN_NO_CHANGE, UART_PIN_NO_CHANGE);
    uart_driver_install(UART_NUM_1, 4096*5, 0, 0, NULL, 0);
}

//queue init
void queue_init(){
    msg_queue = xQueueCreate(10, sizeof(msg_struct));
    if (msg_queue == NULL) {
        ESP_LOGE(main_tag, "Failed to create queue");
    }
}

// 检查WiFi连接状态
static bool is_wifi_connected(void)
{
    wifi_ap_record_t ap_info;
    if (esp_wifi_sta_get_ap_info(&ap_info) == ESP_OK)
    {
        return true;
    }
    return false;
}

// 进行OTA升级
esp_err_t perform_ota_update(void)
{
    esp_http_client_config_t config = {
        .url = CONFIG_FIRMWARE_UPGRADE_URL,
        .cert_pem = (char *)server_cert_pem_start,
        .timeout_ms = CONFIG_OTA_RECV_TIMEOUT,
        .keep_alive_enable = true,
    };
    esp_https_ota_config_t ota_config = {
        .http_config = &config,
    };
    esp_err_t ret = esp_https_ota(&ota_config);
    if (ret == ESP_OK) {
        esp_restart();
    } else {
        return ESP_FAIL;
    }
    return ESP_OK;
}

// Main function
void app_main(void)
{
    // Initialize NVS
    esp_err_t ret;
    ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
    {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    // Initialize Bluetooth
    ble_init();

    // Initialize UART
    init_uart();

    // Queue init
    queue_init();

    // Task init
    xTaskCreate(send_msg_to_stm32, "send_msg_to_stm32", 4096 * 5, NULL, 5, NULL);

    // Initialize WIFI
    initialise_wifi();

    // Check WiFi connection
    int retry_count = 0;
    while (!is_wifi_connected() && retry_count < WIFI_CONNECT_RETRY_MAX) {
        ESP_LOGI(TAG, "WiFi not connected, waiting...");
        vTaskDelay(2000 / portTICK_PERIOD_MS); // Wait for 2 seconds before retrying
        retry_count++;
    }
    
    if (retry_count >= WIFI_CONNECT_RETRY_MAX) {
        ESP_LOGE(TAG, "Failed to connect to WiFi after maximum retries");
    }
    
    // Perform OTA Update
    if(is_wifi_connected()){
        ESP_LOGI(TAG, "WiFi connected, starting OTA update");
        ret = perform_ota_update();
        if (ret != ESP_OK) {
            ESP_LOGE(TAG, "OTA update failed");
        }
    }
    else{
        ESP_LOGE(TAG, "WiFi not connected, cannot perform OTA update");
    }
}

// main.c
void send_msg_to_stm32(void *pvParameters) {
    msg_struct msg_data;
    while (1) {
        if (xQueueReceive(msg_queue, &msg_data, portMAX_DELAY)) {
            char uart_data[2048];

            switch (msg_data.type) {
                case DataType_Control:
                    snprintf(uart_data, sizeof(uart_data), "{\"Type\":\"Control\",\"L\":%d,\"R\":%d,\"A\":%d}\n",
                             msg_data.leftWheelSpeed,
                             msg_data.rightWheelSpeed,
                             msg_data.action);
                    break;
                case DataType_Weather:
                    snprintf(uart_data, sizeof(uart_data), "{\"Type\":\"Weather\",\"Data\":\"%s\"}\n",
                             msg_data.weatherData);
                    break;
                case DataType_PID:
                    snprintf(uart_data, sizeof(uart_data), "{\"Type\":\"PID\",\"Balance_Kp\":%f,\"Balance_Ki\":%f,\"Balance_Kd\":%f,\"Velocity_Kp\":%f,\"Velocity_Ki\":%f,\"Velocity_Kd\":%f}\n",
                            msg_data.balancePID.Kp,
                            msg_data.balancePID.Ki,
                            msg_data.balancePID.Kd,
                            msg_data.velocityPID.Kp,
                            msg_data.velocityPID.Ki,
                            msg_data.velocityPID.Kd);
                    break;
                case DataType_Mode_Control:
                    snprintf(uart_data, sizeof(uart_data), "{\"Type\":\"Mode_Control\"}\n");
                    break;
                default:
                    ESP_LOGE(main_tag, "Unknown data type received");
                    continue;  // Skip the uart_write_bytes if the type is unknown
            }

            uart_write_bytes(UART_NUM_1, uart_data, strlen(uart_data));
            ESP_LOGI(main_tag, "Sent data to UART: %s", uart_data);
        }
    }
}
