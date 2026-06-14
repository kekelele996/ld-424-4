export enum HazardLevel {
  Safe = 'Safe',
  Irritant = 'Irritant',
  Corrosive = 'Corrosive',
  Flammable = 'Flammable',
  Toxic = 'Toxic',
  Explosive = 'Explosive',
}

export enum UsageStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export enum StorageCondition {
  RoomTemp = 'RoomTemp',
  Refrigerated = 'Refrigerated',
  Frozen = 'Frozen',
  Dark = 'Dark',
  Ventilated = 'Ventilated',
}

export enum ItemType {
  Reagent = 'Reagent',
  Consumable = 'Consumable',
}

export enum QCResult {
  Pass = 'Pass',
  Fail = 'Fail',
  Skip = 'Skip',
}

export enum Role {
  Admin = 'Admin',
  LabManager = 'LabManager',
  Researcher = 'Researcher',
  Student = 'Student',
}

export enum ConsumableCategory {
  Glassware = 'Glassware',
  Plasticware = 'Plasticware',
  Filter = 'Filter',
  Pipette = 'Pipette',
  Tube = 'Tube',
  Other = 'Other',
}

export enum InventoryCheckStatus {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Discrepancy = 'Discrepancy',
}

export enum ReservationStatus {
  Pending = 'Pending',
  Fulfilled = 'Fulfilled',
  Cancelled = 'Cancelled',
  Expired = 'Expired',
}
