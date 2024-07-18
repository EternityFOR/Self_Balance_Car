#include "Gyro.h"
#include "main.h"

extern I2C_HandleTypeDef hi2c1;

IMU_SensorData_Raw_Structer IMU_SensorData_Raw;

uint8_t BSP_MPU6050_ReadReg(uint8_t address)
{
	uint8_t Value = 0;
	HAL_I2C_Mem_Read(&hi2c1,IMU_ADDRESS_READ,address,I2C_MEMADD_SIZE_8BIT,&Value,1,0x10);
	return Value;
}

void BSP_MPU6050_ReadMultiReg(uint8_t address,uint8_t length,uint8_t *data)
{
	HAL_I2C_Mem_Read(&hi2c1,IMU_ADDRESS_READ,address,I2C_MEMADD_SIZE_8BIT,data,length,0x10);
}

void BSP_MPU6050_WriteReg(uint8_t address,uint8_t data)
{
	HAL_I2C_Mem_Write(&hi2c1,IMU_ADDRESS_WRITE,address,I2C_MEMADD_SIZE_8BIT,&data,1,0x10);
	HAL_Delay(100);
}

void BSP_MPU6050_WriteMultiReg(uint8_t address,uint8_t length,uint8_t *data)
{
	HAL_I2C_Mem_Write(&hi2c1,IMU_ADDRESS_WRITE,address,I2C_MEMADD_SIZE_8BIT,data,length,0x10);
	HAL_Delay(100);
}

uint8_t BSP_MPU6050_Read_WHOAMI(void)
{
	return BSP_MPU6050_ReadReg(MPUREG_WHOAMI);
}

uint8_t BSP_MPU6050_Init(void)
{
	uint8_t tries;

	for(tries = 0; tries<5; tries++)
	{
		BSP_MPU6050_WriteReg(MPUREG_PWR_MGMT_1,BIT_PWR_MGMT_1_DEVICE_RESET); // reset mpu6050 5050
		BSP_MPU6050_WriteReg(MPUREG_PWR_MGMT_1,BIT_PWR_MGMT_1_CLK_ZGYRO); // Set the clock
		if(BSP_MPU6050_ReadReg(MPUREG_PWR_MGMT_1) == BIT_PWR_MGMT_1_CLK_ZGYRO)
			break;
	}
	if(tries == 5)
		return 0;

	BSP_MPU6050_WriteReg(MPUREG_PWR_MGMT_2,0x00);// Forbidden Sleep
	BSP_MPU6050_WriteReg(MPUREG_USER_CTRL,0x00);// I2C main mode closed
	BSP_MPU6050_WriteReg(MPUREG_CONFIG,BITS_DLPF_CFG_20HZ);// Set low -pass filter
	BSP_MPU6050_WriteReg(MPUREG_SMPLRT_DIV,MPUREG_SMPLRT_200HZ);// Set the sampling frequency
	BSP_MPU6050_WriteReg(MPUREG_GYRO_CONFIG,BITS_GYRO_FS_2000DPS);// Set the acceleration metering program
	BSP_MPU6050_WriteReg(MPUREG_ACCEL_CONFIG,BITS_ACCEL_FS_8G);// Set the gyroscope measuring range range
	BSP_MPU6050_WriteReg(MPUREG_INT_ENABLE,0x00);// Forbidden interruption

	if(BSP_MPU6050_Read_WHOAMI() == IMU_WHOAMI)
		return 1;
	else
		return 0;
}

void BSP_MPU6050_UpdateSensors(void)
{
	uint8_t buffer[14];
	BSP_MPU6050_ReadMultiReg(MPUREG_ACCEL_XOUT_H,14,buffer);
	IMU_SensorData_Raw.ACC_X = (buffer[0]<<8)|buffer[1];
	IMU_SensorData_Raw.ACC_Y = (buffer[2]<<8)|buffer[3];
	IMU_SensorData_Raw.ACC_Z = (buffer[4]<<8)|buffer[5];
	IMU_SensorData_Raw.Temp = (buffer[6]<<8)|buffer[7];
	IMU_SensorData_Raw.GYR_X = (buffer[8]<<8)|buffer[9];
	IMU_SensorData_Raw.GYR_Y = (buffer[10]<<8)|buffer[11];
	IMU_SensorData_Raw.GYR_Z = (buffer[12]<<8)|buffer[13];
}
