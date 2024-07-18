#include "Encoder.h"
#include "main.h"
int Motor_R_Encoder_Counter;
int Motor_L_Encoder_Counter;
//extern TIM_HandleTypeDef htim2;
//extern TIM_HandleTypeDef htim4;
extern TIM_HandleTypeDef htim3;
extern TIM_HandleTypeDef htim5;

int GetEncoder_Counter_R(void)
{
	Motor_R_Encoder_Counter = (short)(__HAL_TIM_GET_COUNTER(&htim5));
    __HAL_TIM_SET_COUNTER(&htim5,0);
    return Motor_R_Encoder_Counter;
}
int GetEncoder_Counter_L(void)
{
	Motor_L_Encoder_Counter = (short)(__HAL_TIM_GET_COUNTER(&htim3));
    __HAL_TIM_SET_COUNTER(&htim3,0);
    return Motor_L_Encoder_Counter;
}
