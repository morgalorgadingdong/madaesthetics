const mongoose = require('mongoose')

// const firstCheckInSchema = new mongoose.Schema({
//   medications: {
//     type: Array
//   },
//   medicalHistory: {
//     type: Array
//   },
//   lifestyleQ1: {
//     type: 'String'
//   }
// })
// const FirstCheckIn = mongoose.model('FirstCheckIn', firstCheckInSchema)

// const secondCheckInSchema = new mongoose.Schema({

// })
// const SecondCheckIn = mongoose.model('SecondCheckIn', secondCheckInSchema)

// const SecondCheckInAcneMedSchema = new mongoose.Schema({

// })
// const SecondCheckInAcneMed = mongoose.model('SecondCheckInAcneMed', SecondCheckInAcneMedSchema)

// const defaultCheckInSchema = new mongoose.Schema({

// })
// const defaultCheckIn = mongoose.model('defaultCheckIn', defaultCheckInSchema)

const checkInSchema = new mongoose.Schema({
  checkIn: {
    type: String,
    required: true,
  },
  acneMed: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  emailReminder: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    required: true
  },
  active: {
    type: Boolean,
    required: true
  },
  submitted: {
    type: Boolean,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  reviewed: {
    type: Boolean,
    required: true
  },
  pic1URL: {
    type: String,
    default: ''
  },
  pic2URL: {
    type: String,
    default: ''
  },
  pic3URL: {
    type: String,
    default: ''
  },
  firstCheckIn: {
    nameFirst: {
      type: String,
      default: ''
    },
    nameLast: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    phone: '',
    age: '',
    accutaneStart: '',
    accutaneDuration: '',
    androstendioneStart: '',
    androstendioneDuration: '',
    antibioticsStart: '',
    antibioticsDuration: '',
    avitaStart: '',
    avitaDuration: '',
    azelexStart: '',
    azelexDuration: '',
    benzoylStart: '',
    benzoylDuration: '',
    cleocinStart: '',
    cleocinDuration: '',
    cocaineStart: '',
    cocaineDuration: '',
    copaxoneStart: '',
    copaxoneDuration: '',
    corticosteroidsStart: '',
    corticosteroidsDuration: '',
    creamMedDescription: '',
    creamStart: '',
    creamDuration: '',
    cyclosporinStart: '',
    cyclosporinDuration: '',
    danzolStart: '',
    danzolDuration: '',
    differinStart: '',
    differinDuration: '',
    dilantinStart: '',
    dilantinDuration: '',
    disulfuramStart: '',
    disulfuramDuration: '',
    emycinStart: '',
    emycinDuration: '',
    isoniazidStart: '',
    isoniazidDuration: '',
    immuranStart: '',
    immuranDuration: '',
    lithiumStart: '',
    lithiumDuration: '',
    marijuanaStart: '',
    marijuanaDuration: '',
    peroxideStart: '',
    peroxideDuration: '',
    progesteroneStart: '',
    progesteroneDuration: '',
    quinineStart: '',
    quinineDuration: '',
    retinAStart: '',
    retinADuration: '',
    steroidStart: '',
    steroidDuration: '',
    tazoracStart: '',
    tazoracDuration: '',
    testosteroneStart: '',
    testosteroneDuration: '',
    thyroidStart: '',
    thyroidDuration: '',
    otherMedDescription: '',
    otherMedStart: '',
    otherMedDuration: '',
    herpes: '',
    eczema: '',
    psoriasis: '',
    hepatitis: '',
    cancer: '',
    mrsa: '',
    hiv: '',
    thyroidProblems: '',
    hormoneProblems: '',
    hysterectomy: '',
    overiesRemoved: '',
    pacemaker: '',
    hemophilia: '',
    lupus: '',
    anemia: '',
    highBloodPressure: '',
    diabetes: '',
    metalPinsInBody: '',
    lifestyleQ1: '',
    lifestyleQ2: '',
    lifestyleQ3: '',
    lifestyleQ4: '',
    lifestyleQ5: '',
    lifestyleQ6: '',
    lifestyleQ7: '',
    lifestyleQ8: '',
    lifestyleQ9: '',
    lifestyleQ10: '',
    lifestyleQ11: '',
    lifestyleQ12: '',
    fastFood: '',
    processedFood: '',
    saltySnacks: '',
    milk: '',
    cheese: '',
    whey: '',
    peanutButter: '',
    peanuts: '',
    sushi: '',
    kelp: '',
    miso: '',
    soy: '',
    vitaminSupplements: '',
    seafood: '',
    cleanser: '',
    toner: '',
    serum: '',
    moisturizer: '',
    sunscreen: '',
    mask: '',
    foundation: '',
    blush: '',
    exfoliant: '',
    acneMedications: '',
    productsOther: '',
    chemicalPeelDescription: '',
    chemicalPeelWhen: '',
    chemicalPeelWhere: '',
    microdermabrasionWhen: '',
    microdermabrasionWhere: '',
    dermabrasionWhen: '',
    dermabrasionWhere: '',
    laserHairRemovalWhen: '',
    laserHairRemovalWhere: '',
    laserRejuvenationWhen: '',
    laserRejuvenationWhere: '',
    skinCancerRemovalWhen: '',
    skinCancerRemovalWhere: '',
    facialWaxingWhen: '',
    facialWaxingWhere: '',
    ElectrolysisWhen: '',
    ElectrolysisWhere: '',
    otherTreatmentsDescription: '',
    otherTreatmentsWhen: '',
    otherTreatmentsWhere: ''
  },
  defaultCheckIn: {  
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    acneMedQ: ''
  },
  reviewComments: {
    type: String,
    default: ''
  }
  // secondCheckIn: {
  //   type: mongoose.ObjectId,
  //   ref: 'SecondCheckIn',
  //   required: false
  // },
  // secondCheckInAcneMed: {
  //   type: mongoose.ObjectId,
  //   ref: 'SecondCheckInAcneMed',
  //   required: false
  // },
  // defaultCheckIn: {
  //   type: mongoose.ObjectId,
  //   ref: 'DefaultCheckIn',
  //   required: false
  // }
})

module.exports = mongoose.model('Bootcamp', checkInSchema)



    // medications: {
    //   accutane: {
    //     start: {
    //       type: Date
    //     },
    //     duration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   androstendione: {
    //     start: {
    //       type: Date
    //     },
    //     duration: {
    //       type: String,
    //       default: 0
    //     },
    //   },
    //   antibiotics: {
    //     start: {
    //       type: Date
    //     },
    //     duration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   avita: {
    //     start: {
    //       type: Date
    //     },
    //     duration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   azelex: {
    //     start: {
    //       type: Date
    //     },
    //     duration: {
    //       type: Number,
    //       default: 0
    //     }
    //   },
    //   benzoyl: {
    //     start: {
    //       type: Date
    //     },
    //     duration: {
    //       type: Number,
    //       default: 0
    //     }
    //   },
    //   cleocin: {
    //     cleocinstart: {
    //       type: Date
    //     },
    //     cleocinduration: {
    //       type: Number,
    //       default: 0
    //     }
    //   },
    //   cocaine: {
    //     cocainestart: {
    //       type: Date
    //     },
    //     cocaineDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   copaxone: {
    //     copaxonestart: {
    //       type: Date
    //     },
    //     copaxoneDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   corticosteroids: {
    //     corticosteroidsstart: {
    //       type: Date
    //     },
    //     corticosteroidsDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   cream: {
    //     creamMedDescription: {
    //       type: String
    //     },
    //     creamstart: {
    //       type: Date
    //     },
    //     creamDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   cyclosporin: {
    //     cyclosporinstart: {
    //       type: Date
    //     },
    //     cyclosporinDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   danzol: {
    //     danzolstart: {
    //       type: Date
    //     },
    //     danzolDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   differin: {
    //     differinstart: {
    //       type: Date
    //     },
    //     differinDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   dilantin: {
    //     dilantinstart: {
    //       type: Date
    //     },
    //     dilantinDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   disulfuram: {
    //     disulfuramstart: {
    //       type: Date
    //     },
    //     disulfuramDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   emycin: {
    //     emycinstart: {
    //       type: Date
    //     },
    //     emycinDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   isoniazid: {
    //     isoniazidstart: {
    //       type: Date
    //     },
    //     isoniazidDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   immuran: {
    //     immuranstart: {
    //       type: Date
    //     },
    //     immuranDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   lithium: {
    //     lithiumstart: {
    //       type: Date
    //     },
    //     lithiumDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   marijuana: {
    //     marijuanastart: {
    //       type: Date
    //     },
    //     marijuanaDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   peroxide: {
    //     peroxidestart: {
    //       type: Date
    //     },
    //     peroxideDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   progesterone: {
    //     progesteronestart: {
    //       type: Date
    //     },
    //     progesteroneDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   quinine: {
    //     quininestart: {
    //       type: Date
    //     },
    //     quinineDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   retinA: {
    //     retinAstart: {
    //       type: Date
    //     },
    //     retinADuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   steroids: {
    //     steroidsstart: {
    //       type: Date
    //     },
    //     steroidsDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   tazorac: {
    //     tazoracstart: {
    //       type: Date
    //     },
    //     tazoracDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   testosterone: {
    //     testosteronestart: {
    //       type: Date
    //     },
    //     testosteroneDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   thyroid: {
    //     thyroidstart: {
    //       type: Date
    //     },
    //     thyroidDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    //   otherMed: {
    //     otherMedDescription: {
    //       type: String
    //     },
    //     otherMedstart: {
    //       type: Date
    //     },
    //     otherMedDuration: {
    //       type: String,
    //       default: 0
    //     }
    //   },
    // },
    // medicalHistory: {
    //   herpes: {
    //     type: Boolean
    //   },
    //   eczema: {
    //     type: Boolean
    //   },
    //   psoriasis: {
    //     type: Boolean
    //   },
    //   hepatitis: {
    //     type: Boolean
    //   },
    //   cancer: {
    //     type: Boolean
    //   },
    //   mrsa: {
    //     type: Boolean
    //   },
    //   hiv: {
    //     type: Boolean
    //   },
    //   thyroidProblems: {
    //     type: Boolean
    //   },
    //   hormoneProblems: {
    //     type: Boolean
    //   },
    //   hysterectomy: {
    //     type: Boolean
    //   },
    //   overiesRemoved: {
    //     type: Boolean
    //   },
    //   pacemaker: {
    //     type: Boolean
    //   },
    //   hemophilia: {
    //     type: Boolean
    //   },
    //   lupus: {
    //     type: Boolean
    //   },
    //   anemia: {
    //     type: Boolean
    //   },
    //   highBloodPressure: {
    //     type: Boolean
    //   },
    //   diabetes: {
    //     type: Boolean
    //   },
    //   metalPinsInBody: {
    //     type: Boolean
    //   },
    // },
    // lifestyle: {
    // lifestyleQ1: {
    //   type: Boolean
    // },
    // lifestyleQ2: {
    //   type: Boolean
    // },
    // lifestyleQ3: {
    //   type: Boolean
    // },
    // lifestyleQ4: {
    //   type: Boolean
    // },
    // lifestyleQ5: {
    //   type: Boolean
    // },
    // lifestyleQ6: {
    //   type: Boolean
    // },
    // lifestyleQ7: {
    //   type: Boolean
    // },
    // lifestyleQ8: {
    //   type: Boolean
    // },
    // lifestyleQ9: {
    //   type: Boolean
    // },
    // lifestyleQ10: {
    //   type: Boolean
    // },
    // lifestyleQ11: {
    //   type: Boolean
    // },
    // lifestyleQ12: {
    //   type: Boolean
    // }
    // },
    // diet: {
    // fastFood: {
    //   type: Boolean
    // },
    // processedFood: {
    //   type: Boolean
    // },
    // saltySnacks: {
    //   type: Boolean
    // },
    // milk: {
    //   type: Boolean
    // },
    // cheese: {
    //   type: Boolean
    // },
    // whey: {
    //   type: Boolean
    // },
    // peanutButter: {
    //   type: Boolean
    // },
    // peanuts: {
    //   type: Boolean
    // },
    // sushi: {
    //   type: Boolean
    // },
    // kelp: {
    //   type: Boolean
    // },
    // miso: {
    //   type: Boolean
    // },
    // soy: {
    //   type: Boolean
    // },
    // vitaminSupplements: {
    //   type: Boolean
    // },
    // seafood: {
    //   type: Boolean
    // }
    // },
    // products: {
    // cleanser: {
    //   type: String
    // },
    // toner: {
    //   type: String
    // },
    // serum: {
    //   type: String
    // },
    // moisturizer: {
    //   type: String
    // },
    // sunscreen: {
    //   type: String
    // },
    // mask: {
    //   type: String
    // },
    // foundation: {
    //   type: String
    // },
    // blush: {
    //   type: String
    // },
    // exfoliant: {
    //   type: String
    // },
    // acneMedications: {
    //   type: String
    // },
    // productsOther: {
    //   type: String
    // },
    // },
    // treatments: {
    // chemicalPeel: {
    //   description: {
    //     type: String
    //   },
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // microdermabrasion: {
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // dermabrasion: {
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // laserHairRemoval: {
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // laserRejuvenation: {
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // skinCancerRemoval: {
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // facialWaxing: {
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // electrolysis: {
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // otherTreatments: {
    //   description: {
    //     type: String
    //   },
    //   when: {
    //     type: Date
    //   },
    //   where: {
    //     type: Number,
    //     default: 0
    //   }
    // },
    // },