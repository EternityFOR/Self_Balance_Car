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
//***Parameters***
//Tags
#define main_tag "main"
//UART pin assign
#define TXD_PIN (GPIO_NUM_17)
#define RXD_PIN (GPIO_NUM_18)

//Queue
QueueHandle_t msg_queue = NULL;

//Data type

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

//Main function
void app_main(void)
{
    // Initialize NVS
    esp_err_t ret;
    ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK( ret );

    // Initialize WIFI
    initialise_wifi();

    // Start getting time and weather
    // weather_time_task_init();
    
    //Initialize Blutooth
    ble_init();

    // Intialize UART
    init_uart();

    //Queue init
    queue_init();

    //Task init
    xTaskCreate(send_msg_to_stm32, "send_msg_to_stm32", 4096*5, NULL, 5, NULL);


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