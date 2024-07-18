idf_component_register(SRCS "Data_handle.c"
                        PRIV_REQUIRES "json"
                        PRIV_REQUIRES "driver"
                        PRIV_REQUIRES "main"
                        PRIV_REQUIRES "BLUFI_t"
                        INCLUDE_DIRS "include" )
target_compile_options(${COMPONENT_LIB} PRIVATE "-Wno-format")