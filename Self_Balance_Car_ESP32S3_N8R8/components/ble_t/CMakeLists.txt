idf_component_register(SRCS "ble_t.c"
                        PRIV_REQUIRES "driver"
                        PRIV_REQUIRES "bt"
                        PRIV_REQUIRES "spi_flash"
                        PRIV_REQUIRES "mbedtls"
                        PRIV_REQUIRES "json"
                        PRIV_REQUIRES "Data_handle"
                        INCLUDE_DIRS "include" )
target_compile_options(${COMPONENT_LIB} PRIVATE "-Wno-format")