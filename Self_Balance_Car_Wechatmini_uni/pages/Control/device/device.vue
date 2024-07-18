<template>
	<!-- pages/carControl/carControl.wxml -->
	<view class="container">
		<view class="control-panel">
			<button class="rotate pid" @tap="PID_Adjust" style="position: absolute; right: 0%; top: 45%; width: 40%; height: 7%;">
				PID Adjust
			</button>
			<button class="rotate stop" @tap="stopCar" style="position: absolute; right: 30%; top: 45%; width: 35%; height: 7%;">Stop</button>
		</view>
		<view class="wheel-control">
			<button class="rotate Left" data-wheel="left" :data-increase="true" @touchstart="changeDirectionStart" @touchend="changeDirectionEnd" style="position: absolute; left: 5%; top: 7%">←</button>
			<button class="rotate Right" data-wheel="right" :data-increase="true" @touchstart="changeDirectionStart" @touchend="changeDirectionEnd" style="position: absolute; left: 5%; top: 20%">→</button>
			<button class="rotate Forward" @touchstart="handleDirection" @touchend="handleDirection" data-direction="1" style="position: absolute; left: 18%; top: 72%">↑</button>
			<button class="rotate Backward" @touchstart="handleDirection" @touchend="handleDirection" data-direction="-1" style="position: absolute; left: -5%; top: 72%">↓</button>
		</view>
	</view>
</template>

<script>
	const BLE_util = require('../../../utils/BLE_util');

	export default {
		data() {
			return {
				// UI state
				displayLeftWheelSpeed: 0,
				displayRightWheelSpeed: 0,
				leftWheelSpeed: 0,
				rightWheelSpeed: 0,
				maxSpeed: 200,
				minSpeed: -200,
				initialSpeed: 200,
				changingSpeed: false,
				speedChangeInterval: null,
				speedChangeRate: 200,
				speedChangeRateMax: 20,
				speedupChangeIntervalTime: 200,
				deceleratingRate: 200,
				decelerationIntervalTime: 200,
				decelerating: false,
				speedChangeDelay: 200,
				direction: 0,
				forwardBackwardPressed: false,
				speedChangeTimeout: null
			};
		},
		onUnload() {
			this.stopSpeedChange();
			clearTimeout(this.speedChangeTimeout);
		},
		methods: {
			handleDirection(event) {
				const direction = parseInt(event.currentTarget.dataset.direction);
				const isTouchEnd = event.type === 'touchend';

				if (!isTouchEnd) {
					this.startSpeedChange(direction === 1);
				} else {
					this.stopSpeedChange();
					this.stopCar();
					// this.decelerateWithDelay();
				}
			},
			startSpeedChange(increase) {
				if (!this.changingSpeed) {
					this.changingSpeed = true;
					this.forwardBackwardPressed = true;
					this.direction = increase ? 1 : -1;
					clearTimeout(this.speedChangeTimeout);
					this.decelerating = false;
					this.changeSpeed(increase);
				}
			},
			changeSpeed(increase) {
				const speedChange = () => {
					let baseSpeed = this.leftWheelSpeed === 0 ? (increase ? this.initialSpeed : -this.initialSpeed) : this.leftWheelSpeed;
					let newSpeed = baseSpeed + (increase ? this.speedChangeRate : -this.speedChangeRate);
					newSpeed = Math.max(this.minSpeed, Math.min(this.maxSpeed, newSpeed));
					this.leftWheelSpeed = newSpeed;
					this.rightWheelSpeed = newSpeed;
					this.updateCarSpeed();
				};
				this.speedChangeInterval = setInterval(speedChange, this.speedupChangeIntervalTime);
			},
			updateCarSpeed() {
				const finalLeftWheelSpeed = this.leftWheelSpeed;
				const finalRightWheelSpeed = this.rightWheelSpeed;

				if (this.displayLeftWheelSpeed !== finalLeftWheelSpeed || this.displayRightWheelSpeed !== finalRightWheelSpeed) {
					this.displayLeftWheelSpeed = finalLeftWheelSpeed;
					this.displayRightWheelSpeed = finalRightWheelSpeed;
					this.sendControlSignal({
						leftWheelSpeed: finalLeftWheelSpeed,
						rightWheelSpeed: finalRightWheelSpeed,
						Type: 'Car_ctr'
					});
				}
			},
			stopSpeedChange() {
				clearInterval(this.speedChangeInterval);
				this.changingSpeed = false;
				this.forwardBackwardPressed = false;
				this.direction = 0;
			},
			decelerateWithDelay() {
				this.speedChangeTimeout = setTimeout(() => {
					if (!this.decelerating && this.direction === 0) {
						this.decelerate();
					}
				}, this.speedChangeDelay);
			},
			decelerate() {
				if (this.decelerating || this.direction !== 0) return;

				this.decelerating = true;
				const decelerateStep = () => {
					if (!this.decelerating) return;

					const newSpeedLeft = this.adjustSpeed(this.leftWheelSpeed);
					const newSpeedRight = this.adjustSpeed(this.rightWheelSpeed);

					this.leftWheelSpeed = newSpeedLeft;
					this.rightWheelSpeed = newSpeedRight;
					this.updateCarSpeed();

					if (newSpeedLeft !== 0 || newSpeedRight !== 0) {
						setTimeout(decelerateStep, this.decelerationIntervalTime);
					}
				};
				decelerateStep();
			},
			adjustSpeed(speed) {
				let decrement = speed > 0 ? -this.deceleratingRate : speed < 0 ? this.deceleratingRate : 0;
				let newSpeed = speed + decrement;

				if ((speed > 0 && newSpeed < 0) || (speed < 0 && newSpeed > 0)) {
					newSpeed = 0;
				}
				return newSpeed;
			},
			changeDirectionStart(event) {
				const wheel = event.currentTarget.dataset.wheel;
				const increase = event.currentTarget.dataset.increase === 'true';
				const changeRate = () => {
					const speedChangeRateDirection = increase ? this.speedChangeRate : -this.speedChangeRate;
					if (wheel === 'left') {
						this.adjustWheelSpeed('left', -speedChangeRateDirection);
					} else if (wheel === 'right') {
						this.adjustWheelSpeed('right', -speedChangeRateDirection);
					}
				};

				if (this.direction !== 0 || this.forwardBackwardPressed) {
					clearInterval(this.speedChangeInterval);
					this.speedChangeInterval = setInterval(changeRate, this.speedupChangeIntervalTime);
				} else {
					changeRate();
				}
			},
			changeDirectionEnd() {
				clearInterval(this.speedChangeInterval);
				if (this.forwardBackwardPressed) {
					this.changingSpeed = false;
					this.changeSpeed(this.direction === 1);
				} else {
					this.stopSpeedChange();
					this.stopCar();
				}
			},
			adjustWheelSpeed(wheel, speedChange) {
				if (wheel === 'left') {
					// this.leftWheelSpeed = this.clampSpeed(this.leftWheelSpeed + speedChange);
					// this.rightWheelSpeed = this.clampSpeed(this.rightWheelSpeed - speedChange);
					this.leftWheelSpeed = 0;
					if(this.rightWheelSpeed == 0){
						this.rightWheelSpeed = 200;
					}
				} else {
					// this.rightWheelSpeed = this.clampSpeed(this.rightWheelSpeed + speedChange);
					// this.leftWheelSpeed = this.clampSpeed(this.leftWheelSpeed - speedChange);
					this.rightWheelSpeed = 0;
					if(this.leftWheelSpeed == 0){
						this.leftWheelSpeed = 200;
					}
				}
				this.updateCarSpeed();
			},
			clampSpeed(speed) {
				return Math.max(0, Math.min(this.maxSpeed, speed));
			},
			sendControlSignal(signal) {
				BLE_util.Write_data_BLE(signal)
					.then(res => console.log('Signal sent successfully:', res))
					.catch(err => console.error('Error sending signal:', err));
			},
			stopCar() {
				this.leftWheelSpeed = 0;
				this.rightWheelSpeed = 0;
				this.displayLeftWheelSpeed = 0;
				this.displayRightWheelSpeed = 0;
				this.sendControlSignal({
					leftWheelSpeed: 0,
					rightWheelSpeed: 0,
					Type: 'Car_ctr'
				});
			},
			PID_Adjust() {
				uni.navigateTo({
					url: '/pages/Control/pidControl/pidControl'
				});
			}
		}
	};
</script>

<style>
	/* pages/carControl/car.wxss */
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.rotate {
		transform: rotate(90deg);
		transform-origin: center;
	}

	button.rotate {
		margin: 10rpx;
	}

	.control-panel {
		display: block;
		flex-direction: row;
		justify-content: space-around;
		align-items: center;
		width: 50%;
	}

	.stop, .pid, .Right, .Left, .Forward, .Backward {
		display: block;
		box-sizing: border-box;
		text-align: center;
		overflow: hidden;
		font-size: 200%;
		font-weight: 3000;
	}

	.stop {
		color: #fff;
		background-color: #f00;
		line-height: 46px;
		font-size: 200%;
		font-weight: 1000;
	}

	.pid {
		color: #fff;
		background-color: #00aaff;
		line-height: 50px;
		font-size: 120%;
		font-weight: 800;
	}

	.Right {
		width: 25%;
		height: 10%;
		line-height: 80px;
		border-right: 5px solid #0055ff;
	}

	.Left {
		width: 25%;
		height: 10%;
		line-height: 80px;
		border-left: 5px solid #f00;
	}

	.Forward {
		width: 35%;
		height: 8%;
		line-height: 55px;
		border-top: 7px solid #f00;
	}

	.Backward {
		width: 35%;
		height: 8%;
		line-height: 55px;
		border-bottom: 7px solid #000;
	}

	.wheel-control {
		display: block;
		flex-direction: column;
		justify-content: space-around;
		align-items: center;
		width: 100%;
		height: 50%;
		right: 60%;
	}
</style>
