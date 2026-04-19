const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  requestType: {
    type: String,
    enum: ['purchase', 'expense', 'leave', 'travel', 'wfh', 'training', 'shift'],
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved_by_teamlead', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Purchase Request Fields
  purchaseDetails: {
    productName: String,
    marketPrice: Number,
    reason: String,
    documentUrl: String
  },
  
  // Expense Reimbursement Fields
  expenseDetails: {
    amount: Number,
    receiptUrl: String,
    description: String
  },
  
  // Leave Request Fields
  leaveDetails: {
    fromDate: Date,
    toDate: Date,
    reason: String,
    numberOfDays: Number
  },

  // Travel Authorization Fields
  travelDetails: {
    travelPurpose: String,
    destination: {
      city: String,
      state: String,
      country: String
    },
    departureDate: Date,
    returnDate: Date,
    totalDays: Number,
    travelMode: String,
    accommodationRequired: Boolean,
    hotelBudget: Number,
    estimatedExpenses: {
      transportation: Number,
      accommodation: Number,
      meals: Number,
      miscellaneous: Number,
      total: Number
    },
    documentUrl: String, // Maps to itinerary/estimates
    clientName: String,
    projectCode: String,
    advanceRequired: Boolean,
    advanceAmount: Number
  },

  // Work From Home (WFH) Fields
  wfhDetails: {
    fromDate: Date,
    toDate: Date,
    totalDays: Number,
    wfhType: String,
    frequency: String,
    reasonCategory: String,
    detailedReason: String,
    tasksPlanned: String, // Stringified list
    availableHours: {
      from: String,
      to: String
    },
    contactNumber: String,
    emergencyContact: String,
    hasRequiredEquipment: Boolean,
    internetSpeed: String,
    scheduledMeetings: String // Stringified list
  },

  // Training Request Fields
  trainingDetails: {
    courseName: String,
    provider: String,
    courseType: String,
    startDate: Date,
    endDate: Date,
    totalDuration: String,
    classSchedule: String,
    hoursPerWeek: Number,
    courseFee: Number,
    examFee: Number,
    materialsCost: Number,
    travelCost: Number,
    totalCost: Number,
    relevanceToRole: String,
    skillsToGain: String,
    careerGoals: String,
    benefitToCompany: String,
    applicableProjects: String,
    documentUrl: String, // Maps to brochure
    completionCommitment: String,
    postTrainingService: String,
    certificationIncluded: Boolean,
    certificationValidity: String
  },

  // Shift Change Request Fields
  shiftDetails: {
    currentShift: {
      shiftType: String,
      startTime: String,
      endTime: String
    },
    requestedShift: {
      shiftType: String,
      startTime: String,
      endTime: String
    },
    changeType: String,
    temporaryDuration: String,
    effectiveFrom: Date,
    reasonCategory: String,
    detailedReason: String,
    circumstanceDetails: {
      medicalCondition: String,
      childcareNeeds: String,
      educationSchedule: String,
      transportationIssues: String
    },
    documentUrl: String, // Maps to medical/supporting docs
    impactOnTeam: String,
    mitigationPlan: String,
    willingToHandover: Boolean,
    handoverPlan: String,
    alternativesSuggested: String
  },
  
  // Approval tracking
  teamLeadApproval: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    },
    comment: String,
    signature: String,
    ipAddress: String,
    userAgent: String
  },
  
  managerApproval: {
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    },
    comment: String,
    signature: String,
    ipAddress: String,
    userAgent: String
  },
  
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rejectionReason: String,
  rejectedAt: Date,
  
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
requestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Request', requestSchema);
