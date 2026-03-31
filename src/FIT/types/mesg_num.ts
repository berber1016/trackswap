export enum MesgNum {
  /**
   * 文件ID
   */
  FILE_ID = 0,
  /**
   * 文件创建者
   */
  FILE_CREATOR = 49,
  /**
   * 时间戳关联
   */
  TIMESTAMP_CORRELATION = 162,
  /**
   * 软件
   */
  SOFTWARE = 35,
  /**
   * 从设备
   */
  SLAVE_DEVICE = 106,
  /**
   * 设备能力
   */
  CAPABILITIES = 1,
  /**
   * 文件能力
   */
  FILE_CAPABILITIES = 37,
  /**
   * 消息能力
   */
  MESG_CAPABILITIES = 38,
  /**
   * 字段能力
   */
  FIELD_CAPABILITIES = 39,
  /**
   * 设备设置
   */
  DEVICE_SETTINGS = 2,
  /**
   * 用户档案
   */
  USER_PROFILE = 3,
  /**
   * 心率监测器档案
   */
  HRM_PROFILE = 4,
  /**
   * 速度距离监测器档案
   */
  SDM_PROFILE = 5,
  /**
   * 自行车档案
   */
  BIKE_PROFILE = 6,
  /**
   * 连接性
   */
  CONNECTIVITY = 127,
  /**
   * 表盘设置
   */
  WATCHFACE_SETTINGS = 159,
  /**
   * 光学心率设置
   */
  OHR_SETTINGS = 188,
  /**
   * 区间时间
   */
  TIME_IN_ZONE = 216,
  /**
   * 区间目标
   */
  ZONES_TARGET = 7,
  /**
   * 运动类型
   */
  SPORT = 12,
  /**
   * 心率区间
   */
  HR_ZONE = 8,
  /**
   * 速度区间
   */
  SPEED_ZONE = 53,
  /**
   * 步频区间
   */
  CADENCE_ZONE = 131,
  /**
   * 功率区间
   */
  POWER_ZONE = 9,
  /**
   * 代谢当量区间
   */
  MET_ZONE = 10,
  /**
   * 训练设置
   */
  TRAINING_SETTINGS = 13,
  /**
   * 潜水设置
   */
  DIVE_SETTINGS = 258,
  /**
   * 潜水警报
   */
  DIVE_ALARM = 262,
  /**
   * 屏息潜水警报
   */
  DIVE_APNEA_ALARM = 393,
  /**
   * 潜水气体
   */
  DIVE_GAS = 259,
  /**
   * 目标
   */
  GOAL = 15,
  /**
   * 活动
   */
  ACTIVITY = 34,
  /**
   * 运动段
   */
  SESSION = 18,
  /**
   * 计圈
   */
  LAP = 19,
  /**
   * 长度
   */
  LENGTH = 101,
  /**
   * 记录点
   */
  RECORD = 20,
  /**
   * 事件
   */
  EVENT = 21,
  /**
   * 设备信息
   */
  DEVICE_INFO = 23,
  /**
   * 设备辅助电池信息
   */
  DEVICE_AUX_BATTERY_INFO = 375,
  /**
   * 训练文件
   */
  TRAINING_FILE = 72,
  /**
   * 天气状况
   */
  WEATHER_CONDITIONS = 128,
  /**
   * 天气预警
   */
  WEATHER_ALERT = 129,
  /**
   * GPS元数据
   */
  GPS_METADATA = 160,
  /**
   * 相机事件
   */
  CAMERA_EVENT = 161,
  /**
   * 陀螺仪数据
   */
  GYROSCOPE_DATA = 164,
  /**
   * 加速度计数据
   */
  ACCELEROMETER_DATA = 165,
  /**
   * 磁力计数据
   */
  MAGNETOMETER_DATA = 208,
  /**
   * 气压计数据
   */
  BAROMETER_DATA = 209,
  /**
   * 3D传感器校准
   */
  THREE_D_SENSOR_CALIBRATION = 167,
  /**
   * 1D传感器校准
   */
  ONE_D_SENSOR_CALIBRATION = 210,
  /**
   * 视频帧
   */
  VIDEO_FRAME = 169,
  /**
   * OBD-II数据
   */
  OBDII_DATA = 174,
  /**
   * NMEA语句
   */
  NMEA_SENTENCE = 177,
  /**
   * 航空姿态
   */
  AVIATION_ATTITUDE = 178,
  /**
   * 视频
   */
  VIDEO = 184,
  /**
   * 视频标题
   */
  VIDEO_TITLE = 185,
  /**
   * 视频描述
   */
  VIDEO_DESCRIPTION = 186,
  /**
   * 视频片段
   */
  VIDEO_CLIP = 187,
  /**
   * 组
   */
  SET = 225,
  /**
   * 跳跃
   */
  JUMP = 285,
  /**
   * 分段
   */
  SPLIT = 312,
  /**
   * 分段总结
   */
  SPLIT_SUMMARY = 313,
  /**
   * 攀爬专业
   */
  CLIMB_PRO = 317,
  /**
   * 字段描述
   */
  FIELD_DESCRIPTION = 206,
  /**
   * 开发者数据ID
   */
  DEVELOPER_DATA_ID = 207,
  /**
   * 路线
   */
  COURSE = 31,
  /**
   * 路线点
   */
  COURSE_POINT = 32,
  /**
   * 段落ID
   */
  SEGMENT_ID = 148,
  /**
   * 段落排行榜条目
   */
  SEGMENT_LEADERBOARD_ENTRY = 149,
  /**
   * 段落点
   */
  SEGMENT_POINT = 150,
  /**
   * 段落计圈
   */
  SEGMENT_LAP = 142,
  /**
   * 段落文件
   */
  SEGMENT_FILE = 151,
  /**
   * 训练
   */
  WORKOUT = 26,
  /**
   * 训练段
   */
  WORKOUT_SESSION = 158,
  /**
   * 训练步骤
   */
  WORKOUT_STEP = 27,
  /**
   * 运动标题
   */
  EXERCISE_TITLE = 264,
  /**
   * 日程安排
   */
  SCHEDULE = 28,
  /**
   * 总计
   */
  TOTALS = 33,
  /**
   * 体重秤
   */
  WEIGHT_SCALE = 30,
  /**
   * 血压
   */
  BLOOD_PRESSURE = 51,
  /**
   * 监测信息
   */
  MONITORING_INFO = 103,
  /**
   * 监测
   */
  MONITORING = 55,
  /**
   * 心率监测数据
   */
  MONITORING_HR_DATA = 211,
  /**
   * 血氧数据
   */
  SPO2_DATA = 269,
  /**
   * 心率
   */
  HR = 132,
  /**
   * 压力水平
   */
  STRESS_LEVEL = 227,
  /**
   * 最大MET数据
   */
  MAX_MET_DATA = 229,
  /**
   * 身体电量数据
   */
  HSA_BODY_BATTERY_DATA = 314,
  /**
   * HSA事件
   */
  HSA_EVENT = 315,
  /**
   * HSA加速度计数据
   */
  HSA_ACCELEROMETER_DATA = 302,
  /**
   * HSA陀螺仪数据
   */
  HSA_GYROSCOPE_DATA = 376,
  /**
   * HSA步数数据
   */
  HSA_STEP_DATA = 304,
  /**
   * HSA血氧数据
   */
  HSA_SPO2_DATA = 305,
  /**
   * HSA压力数据
   */
  HSA_STRESS_DATA = 306,
  /**
   * HSA呼吸数据
   */
  HSA_RESPIRATION_DATA = 307,
  /**
   * HSA心率数据
   */
  HSA_HEART_RATE_DATA = 308,
  /**
   * HSA配置数据
   */
  HSA_CONFIGURATION_DATA = 389,
  /**
   * HSA腕部温度数据
   */
  HSA_WRIST_TEMPERATURE_DATA = 409,
  /**
   * 备忘录
   */
  MEMO_GLOB = 145,
  /**
   * 睡眠等级
   */
  SLEEP_LEVEL = 275,
  /**
   * ANT通道ID
   */
  ANT_CHANNEL_ID = 82,
  /**
   * ANT接收
   */
  ANT_RX = 80,
  /**
   * ANT发送
   */
  ANT_TX = 81,
  /**
   * 扩展显示屏配置
   */
  EXD_SCREEN_CONFIGURATION = 200,
  /**
   * 扩展显示数据字段配置
   */
  EXD_DATA_FIELD_CONFIGURATION = 201,
  /**
   * 扩展显示数据概念配置
   */
  EXD_DATA_CONCEPT_CONFIGURATION = 202,
  /**
   * 潜水总结
   */
  DIVE_SUMMARY = 268,
  /**
   * AAD加速度特性
   */
  AAD_ACCEL_FEATURES = 289,
  /**
   * 心率变异性
   */
  HRV = 78,
  /**
   * 心跳间隔
   */
  BEAT_INTERVALS = 290,
  /**
   * 心率变异性状态总结
   */
  HRV_STATUS_SUMMARY = 370,
  /**
   * 心率变异性值
   */
  HRV_VALUE = 371,
  /**
   * 原始心跳间隔
   */
  RAW_BBI = 372,
  /**
   * 呼吸频率
   */
  RESPIRATION_RATE = 297,
  /**
   * 计时拍摄会话
   */
  CHRONO_SHOT_SESSION = 387,
  /**
   * 计时拍摄数据
   */
  CHRONO_SHOT_DATA = 388,
  /**
   * 水箱更新
   */
  TANK_UPDATE = 319,
  /**
   * 水箱总结
   */
  TANK_SUMMARY = 323,
  /**
   * 睡眠评估
   */
  SLEEP_ASSESSMENT = 346,
  /**
   * 睡眠中断严重程度周期
   */
  SLEEP_DISRUPTION_SEVERITY_PERIOD = 470,
  /**
   * 睡眠中断过夜严重程度
   */
  SLEEP_DISRUPTION_OVERNIGHT_SEVERITY = 471,
  /**
   * 夜间皮肤温度
   */
  SKIN_TEMP_OVERNIGHT = 398,
  /**
   * 填充
   */
  PAD = 105,
}
