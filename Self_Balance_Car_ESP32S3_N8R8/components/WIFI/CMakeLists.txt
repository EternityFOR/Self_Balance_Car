idf_component_register(SRCS "wifi.c"
                        PRIV_REQUIRES "driver"
                        PRIV_REQUIRES "json"
                        PRIV_REQUIRES "esp_http_client"
                        PRIV_REQUIRES "esp_wifi"
                        PRIV_REQUIRES "main"
                        INCLUDE_DIRS "include" )
target_compile_options(${COMPONENT_LIB} PRIVATE "-Wno-format")