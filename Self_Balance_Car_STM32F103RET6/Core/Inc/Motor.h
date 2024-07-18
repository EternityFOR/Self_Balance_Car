#ifndef _INC_MOTOR_H_
#define _INC_MOTOR_H_

#include "stm32f1xx_hal.h"

typedef struct {
    int (*GetEncoderCounter)(void);
    volatile int encoder_counter;
    float targetSpeed;         // Target control speed
    float targetAngle;         // Target control angle
    float currentSpeed;         // Current speed calculated from encoder
    float currentAngle;         // Current Angle
    float velocityBias;
    float velocityError;        // Current error for velocity PID
    float velocityIntegral;     // Integral term for velocity PID
    float velocityPrevError;    // Previous error for velocity PID
    float velocityOutput;       // Output from velocity PID control
    float balanceOutput;        // Output from balance PID control
    float finalOutput;
    uint32_t positiveChannel;   // Timer channel for positive PWM output
    uint32_t negativeChannel;   // Timer channel for negative PWM output
} MotorControl;

// Function prototypes
void Balance_PID_Control(MotorControl *motor_R, MotorControl *motor_L);
void Velocity_PID_Control(MotorControl *motor_R, MotorControl *motor_L);
void CalculateMotorSpeed(MotorControl *motor);
void UpdateMotorPWM(MotorControl *motor_R, MotorControl *motor_L);
void read_angle(MotorControl *motor_R, MotorControl *motor_L);
void StopMotors(MotorControl *motor_R, MotorControl *motor_L);
float RPMToPWM(float targetRPM);
int isCarLifted(MotorControl *motor_R, MotorControl *motor_L);
void initMotorControl(MotorControl *motor,
                      uint32_t positiveChannel,
                      uint32_t negativeChannel,
                      int (*GetEncoderCounter)(void));
#endif /* INC_MOTOR_H_ */
