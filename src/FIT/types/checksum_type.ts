export enum ChecksumType {
  /**
   * Allows clear of checksum for flash memory where can only write 1 to 0 without erasing sector.
   */
  CLEAR = 0,
  /**
   * Set to mark checksum as valid if computes to invalid values 0 or 0xFF. Checksum can also be set to ok to save encoding computation time.
   */
  OK = 1,
}
