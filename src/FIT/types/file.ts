export enum FITFile {
  /**
   * device（只读、单文件、必须在根目录）
   */
  DEVICE = 1,
  /**
   * settings（读写、单文件、Directory=Settings）
   */
  SETTINGS = 2,
  /**
   * sport（读写、多文件、file number = sport type、Directory=Sports）
   */
  SPORT = 3,
  /**
   * activity（读/擦除、多文件、Directory=Activities）
   */
  ACTIVITY = 4,
  /**
   * workout（读写/擦除、多文件、Directory=Workouts）
   */
  WORKOUT = 5,
  /**
   * course（读写/擦除、多文件、Directory=Courses）
   */
  COURSE = 6,
  /**
   * schedules（读写、单文件、Directory=Schedules）
   */
  SCHEDULES = 7,
  /**
   * weight（只读、单文件、环形缓冲、所有消息定义在文件开头、Directory=Weight）
   */
  WEIGHT = 9,
  /**
   * totals（只读、单文件、Directory=Totals）
   */
  TOTALS = 10,
  /**
   * goals（读写、单文件、Directory=Goals）
   */
  GOALS = 11,
  /**
   * bloodPressure（只读、Directory=Blood Pressure）
   */
  BLOOD_PRESSURE = 14,
  /**
   * monitoringA（只读、Directory=Monitoring、file number=sub type）
   */
  MONITORING_A = 15,
  /**
   * activitySummary（读/擦除、多文件、Directory=Activities）
   */
  ACTIVITY_SUMMARY = 20,
  /**
   * monitoringDaily
   */
  MONITORING_DAILY = 28,
  /**
   * monitoringB（只读、Directory=Monitoring、file number=identifier）
   */
  MONITORING_B = 32,
  /**
   * segment（读写/擦除、多文件、Directory=Segments）
   */
  SEGMENT = 34,
  /**
   * segmentList（读写/擦除、单文件、Directory=Segments）
   */
  SEGMENT_LIST = 35,
  /**
   * exdConfiguration（读写/擦除、单文件、Directory=Settings）
   */
  EXD_CONFIGURATION = 40,
  /**
   * mfgRangeMin（0xF7 - 0xFE 保留给厂商自定义 file types）
   */
  MFG_RANGE_MIN = 0xf7,
  /**
   * mfgRangeMax（0xF7 - 0xFE 保留给厂商自定义 file types）
   */
  MFG_RANGE_MAX = 0xfe,
  /**
   * invalid
   */
  INVALID = 255,
}
