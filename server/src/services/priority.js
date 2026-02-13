const EVENT_TYPE_WEIGHT = {
  Seminar: 3,
  Workshop: 4,
  Conference: 5,
  Cultural: 2,
  Sports: 2,
  Default: 1
};

const DEPARTMENT_WEIGHT = {
  CSE: 3,
  ECE: 3,
  MECH: 2,
  CIVIL: 2,
  Default: 1
};

const APPROVAL_WEIGHT = {
  EventCoordinator: 1,
  HOD: 2,
  Dean: 3,
  InstitutionalHead: 4
};

export const calculatePriorityScore = ({ eventType, importance, department, approvalStage }) => {
  const eventTypeWeight = EVENT_TYPE_WEIGHT[eventType] ?? EVENT_TYPE_WEIGHT.Default;
  const departmentWeight = DEPARTMENT_WEIGHT[department] ?? DEPARTMENT_WEIGHT.Default;
  const approvalWeight = APPROVAL_WEIGHT[approvalStage] ?? 1;
  return eventTypeWeight * importance + departmentWeight + approvalWeight;
};
