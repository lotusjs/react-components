import {
  STATUS_NONE,
  STATUS_APPEAR,
  STATUS_ENTER,
  STATUS_LEAVE,
  STEP_NONE,
  STEP_PREPARE,
  STEP_START,
  STEP_ACTIVE,
  STEP_ACTIVATED
} from './config';

export type MotionStatus =
  | typeof STATUS_NONE
  | typeof STATUS_APPEAR
  | typeof STATUS_ENTER
  | typeof STATUS_LEAVE;

export type StepStatus =
  | typeof STEP_NONE
  | typeof STEP_PREPARE
  | typeof STEP_START
  | typeof STEP_ACTIVE
  | typeof STEP_ACTIVATED;
