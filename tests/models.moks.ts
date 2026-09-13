import * as mocks from '@pegasimed.com/testing-tools';
import {
  EXAM_ORDER_MAIN_REPORT,
  DIAGNOSTIC_REPORT_MAIN_REPORT,
  DIAGNOSTIC_REPORT_ANATOMY_INTERPRETATION,
} from './../src/constants/enums';

export const practitionerMock = {
  ...mocks.practitionerMock,
  organization: {
    ...mocks.practitionerMock.organization,
    telecom: [
      ...mocks.practitionerMock.organization.telecom,
      { system: 'phone', use: 'mobile', value: '1234567890' },
      { system: 'email', use: 'administrative', value: 'test@gmail.com' },
    ],
  },
};

export const patientMock = {
  ...mocks.patientMock,
  identifier: mocks.patientCampaignMock.patient.identifier.map((item) => {
    return { ...item, identifierType: { ...item.identifierType, text: 'personal_id' } };
  }),
  telecom: [
    { ...mocks.patientCampaignMock.patient.telecom[0], system: 'phone', use: 'mobile', value: '1234567890' },
    { ...mocks.patientCampaignMock.patient.telecom[0], system: 'email', value: 'test@ttes.com' },
  ],
  generalPractitioner: [practitionerMock],
  extension: [
    {
      extension: [],
      url: '',
      valueCodeableConcept: {
        coding: [],
        text: 'woman',
        displays: [
          {
            value: 'Woman',
            language: 'en',
            _id: '60a08ae14bf088ced83257ea',
          },
          {
            value: 'Mujer',
            language: 'es',
            _id: '60a08ae14bf088ced83257eb',
          },
        ],
        active: true,
        _id: '634780357a440d2d9fbde0da',
      },
      valueBoolean: null,
      valueDate: null,
      valueInteger: null,
      valueString: null,
      valueAddress: null,
      valueAttachment: null,
      valueCoding: null,
      valueContactPoint: null,
      valueHumanName: null,
      valueIdentifier: null,
      valueMoney: null,
      valuePeriod: null,
      valueQuantity: null,
      valueRange: null,
      valueRatio: null,
    },
    {
      extension: [],
      url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity',
      valueCodeableConcept: {
        coding: [],
        text: 'black',
        displays: [
          {
            value: 'Black',
            language: 'en',
            _id: '60a08ae14bf088ced83257ea',
          },
          {
            value: 'Negro/a',
            language: 'es',
            _id: '60a08ae14bf088ced83257eb',
          },
        ],
        active: true,
        _id: '63477d467a440d2d9fbde0ce',
      },
      valueBoolean: null,
      valueDate: null,
      valueInteger: null,
      valueString: null,
      valueAddress: null,
      valueAttachment: null,
      valueCoding: null,
      valueContactPoint: null,
      valueHumanName: null,
      valueIdentifier: null,
      valueMoney: null,
      valuePeriod: null,
      valueQuantity: null,
      valueRange: null,
      valueRatio: null,
    },
  ],
};

export const shiftMock = mocks.shiftMock;
export const stageMock = mocks.stageMock;
export const carePlanMock = { ...mocks.carePlanMock, subject: patientMock };
export const locationMock = mocks.locationMock;
export const receptionMock = {
  ...mocks.receptionMock,
  patient: patientMock,
  __OPTIONS__: {
    scheduleProfile: mocks.scheduleProfileMock,
  },
};
export const appointmentMock = {
  ...mocks.appointmentMock,
  consultationType: {
    ...mocks.appointmentMock.consultationType,
    displays: [{ language: 'es', value: 'Consulta general' }],
  },
  patient: patientMock,
  __OPTIONS__: { scheduleProfile: mocks.scheduleProfileMock },
};

export const locationLogMock = mocks.locationLogMock;
export const carePlanTypeMock = mocks.carePlanTypeMock;
export const carePlanEventMock = { ...mocks.carePlanEventMock, activities: [mocks.carePlanActivityMock] };
export const scheduleProfileMock = mocks.scheduleProfileMock;
export const carePlanActivityMock = mocks.carePlanActivityMock;
export const carePlanActivityLogMock = {
  ...mocks.carePlanMock,
  subject: patientMock,
  beforeActivity: carePlanActivityMock,
  currentActivity: carePlanActivityMock,
};
export const appointmentRequestMock = {
  ...mocks.appointmentRequestMock,
  patient: patientMock,
  __OPTIONS__: {
    externalUrl: 'https://example.com',
    scheduleProfile: mocks.scheduleProfileMock,
  },
};
export const scheduledProcedureMock = {
  ...mocks.scheduledProcedureMock,
  patient: patientMock,
  __OPTIONS__: {
    scheduleProfile: mocks.scheduleProfileMock,
    roomUrl: 'https://example.com',
    eventToken: '1234567890',
    eventRejectUrl: 'https://example.com/reject',
    eventConfirmUrl: 'https://example.com/confirm',
    practitionerRol: { rol: mocks.codeableConceptMock, practitioner: mocks.practitionerMock },
  },
};
export const patientCampaignMock = {
  ...mocks.patientCampaignMock,
  acceptedConfidentialPolicies: true,
  patient: patientMock,
};
export const campaignCandidateMock = {
  patient: patientMock,
  campaignId: 'camp123',
  campaignSubscribed: false,
  active: true,
  licenseKey: 'lic-456',
};
export const notificationProcessorLogMock = {
  notificationTemplate: {
    name: 'Template 1',
  },
  data: {
    name: 'Notification Data',
    model: 'patientConsent',
    payload: mocks.patientConsentMock,
    notification: {
      name: 'Notification 1',
    },
  },
  patient: patientMock,
  response: {
    sms: {
      response: {
        success: true,
      },
      events: [{ type: 'delivered', timestamp: new Date() }],
      messageId: 'sms-msg-123',
    },
    email: {
      response: {
        success: true,
      },
      messageId: 'email-msg-123',
      events: [{ type: 'delivered', timestamp: new Date() }],
    },
    whatsapp: {
      response: {
        success: true,
      },
      send: false,
      messageId: 'wa-msg-123',
      events: [{ type: 'delivered', timestamp: new Date() }],
    },
  },
  success: true,
  error: null,
  licenseKey: 'lic-456',
  active: true,
};
export const patientConsentMock = {
  ...mocks.patientConsentMock,
  date: new Date(),
  patient: patientMock,
};
export const observationMock = {
  ...mocks.observationMock,
  subject: patientMock,
  value: { ...mocks.observationMock.value, finalResult: 'LOW', calculation: 0.1545178 },
  __OPTIONS__: {
    questionnaireResponse: mocks.questionnaireResponseMock,
  },
};
export const externalQuestionnaireMock = {
  ...mocks.externalQuestionnaireMock,
  patient: patientMock,
  __OPTIONS__: {
    meeting: {
      patientsUrl: 'https://example.com/patients',
    },
  },
};
export const diagnosticReportMock = {
  ...mocks.diagnosticReportMock,
  externalCode: '123456',
  subject: patientMock,
  performer: [practitionerMock],
  resultsInterpreter: [observationMock],
  media: [
    ...mocks.diagnosticReportMock.media,
    {
      ...mocks.diagnosticReportMock.media[0],
      link: {
        ...mocks.mediaMock,
        identifier: [
          {
            identifierType: {
              text: DIAGNOSTIC_REPORT_MAIN_REPORT,
            },
            value: DIAGNOSTIC_REPORT_MAIN_REPORT,
          },
        ],
        content: {
          ...mocks.mediaMock.content,
          url: 'https://example.com/diagnostic-report.pdf',
          contentType: 'application/pdf',
        },
      },
    },
  ],
  result: [
    ...mocks.diagnosticReportMock.result,
    {
      ...observationMock,
      identifier: [
        {
          identifierType: {
            text: DIAGNOSTIC_REPORT_ANATOMY_INTERPRETATION,
          },
          value: DIAGNOSTIC_REPORT_ANATOMY_INTERPRETATION,
        },
      ],
    },
    {
      ...observationMock,
      code: {
        text: 'anatomy-interpretation',
        active: true,
        coding: [],
        displays: [],
      },
      interpretation: {
        coding: [],
        text: 'negative',
        displays: [
          {
            value: 'Negative',
            language: 'en',
            _id: '60a08bd24bf088ced8326501',
          },
          {
            value: 'Negativo',
            language: 'es',
            _id: '60a08bd24bf088ced8326502',
          },
        ],
        active: true,
        _id: '684b7064128d35b93079b856',
      },
    },
  ],
};
export const casePreparationMock = {
  ...mocks.caseMock,
  subject: patientMock,
};
export const examOrderMock = {
  ...mocks.examOrderMock,
  media: [
    {
      ...mocks.mediaMock,
      link: {
        ...mocks.mediaMock,
        identifier: [
          {
            identifierType: {
              text: EXAM_ORDER_MAIN_REPORT,
            },
            value: EXAM_ORDER_MAIN_REPORT,
          },
        ],
        content: {
          ...mocks.mediaMock.content,
          url: 'https://example.com/exam-order.pdf',
          contentType: 'application/pdf',
        },
      },
    },
  ],
  pdfGenerated: false,
  patient: patientMock,
};
export const questionnaireResponseMock = { ...mocks.questionnaireResponseMock, OPTIONS: { patient: patientMock } };
export const questionnaireMock = {
  ...mocks.questionnaireMock,
  response: questionnaireResponseMock,
  observations: [
    {
      subject: patientMock,
      effective: { effectiveDateTime: new Date() },
      category: { text: 'Vital Signs' },
      practitioner: mocks.practitionerMock,
      focus: [{ reference: 'mock reference', identifier: 'mock identifier', type: 'questionnaire' }],
      value: {
        name: 'Blood Pressure',
        formula: '[value] === true',
        decimals: 2,
        finalResult: 'HIGH',
        calculation: 0.1545178,
        interpretation: 'HIGH',
        valueCodeableConcept: { value: 'HIGH', text: 'Blood Pressure' },
      },
    },
  ],
};
export const procedureMock = { ...mocks.procedureMock, patient: patientMock };

export const notificationLogMock = {
  _id: '68bb1133ce315c633d75f921',
  data: {
    payload: patientMock,
    notification: mocks.notificationMock,
  },
  response: {
    sms: {
      response: {},
      events: [],
      messageId: 'AXXX7Z5E3F8D1',
    },
    email: {
      response: [
        {
          statusCode: 202,
          body: '',
          headers: {
            server: 'nginx',
            date: 'Fri, 05 Sep 2025 16:34:58 GMT',
            'content-length': '0',
            connection: 'keep-alive',
            'x-message-id': 'PwZ0yMzuQveI1WVxL_eo1A',
            'access-control-allow-origin': 'https://sendgrid.api-docs.io',
            'access-control-allow-methods': 'POST',
            'access-control-allow-headers': 'Authorization, Content-Type, On-behalf-of, x-sg-elas-acl',
            'access-control-max-age': '600',
            'x-no-cors-reason': 'https://sendgrid.com/docs/Classroom/Basics/API/cors.html',
            'strict-transport-security': 'max-age=31536000; includeSubDomains',
            'content-security-policy': "frame-ancestors 'none'",
            'cache-control': 'no-cache',
            'x-content-type-options': 'no-sniff',
            'referrer-policy': 'strict-origin-when-cross-origin',
          },
        },
        '',
      ],
      messageId: 'PwZ0yMzuQveI1WVxL_eo1A',
      events: [
        {
          email: 'devops@pegasi.io',
          event: 'delivered',
          ip: '149.72.61.10',
          response: '250 2.0.0 OK  1757090099 d75a77b69052e-4b48f7bf298si29434161cf.747 - gsmtp',
          sg_event_id: 'ZGVsaXZlcmVkLTAtNTU5MDk5NC1Qd1oweU16dVF2ZUkxV1Z4TF9lbzFBLTA',
          sg_message_id: 'PwZ0yMzuQveI1WVxL_eo1A.recvd-7f4fb8995-fd4g2-1-68BB1132-C.0',
          sg_template_id: 'd-02ff57b132d049cca3554afb7775e798',
          sg_template_name: 'Untitled Version',
          'smtp-id': '<PwZ0yMzuQveI1WVxL_eo1A@geopod-ismtpd-11>',
          timestamp: new Date().toISOString(),
          tls: 1,
        },
        {
          email: 'devops@pegasi.io',
          event: 'processed',
          send_at: 0,
          sg_event_id: 'cHJvY2Vzc2VkLTU1OTA5OTQtUHdaMHlNenVRdmVJMVdWeExfZW8xQS0w',
          sg_message_id: 'PwZ0yMzuQveI1WVxL_eo1A.recvd-7f4fb8995-fd4g2-1-68BB1132-C.0',
          sg_template_id: 'd-02ff57b132d049cca3554afb7775e798',
          sg_template_name: 'Untitled Version',
          'smtp-id': '<PwZ0yMzuQveI1WVxL_eo1A@geopod-ismtpd-11>',
          timestamp: new Date().toISOString(),
        },
        {
          email: 'devops@pegasi.io',
          event: 'open',
          ip: '66.102.8.32',
          sg_content_type: 'html',
          sg_event_id: '6dmx14V0Tge6aVdAj2f-WQ',
          sg_machine_open: false,
          sg_message_id: 'PwZ0yMzuQveI1WVxL_eo1A.recvd-7f4fb8995-fd4g2-1-68BB1132-C.0',
          sg_template_id: 'd-02ff57b132d049cca3554afb7775e798',
          sg_template_name: 'Untitled Version',
          timestamp: new Date().toISOString(),
          useragent: 'Mozilla/5.0 (Windows NT 5.1; rv:11.0) Gecko Firefox/11.0 (via ggpht.com GoogleImageProxy)',
        },
      ],
    },
    whatsapp: {
      response: {
        sent: true,
        message: 'Sent to 5804125408861@c.us',
        description: 'Message has been sent to the provider',
        id: 'wamid.HBgMNTg0MTI1NDA4ODYxFQIAERgSOEJGRDZFQjM2RUYyMzE5NkJDAA==',
      },
      send: true,
      messageId: 'wamid.HBgMNTg0MTI1NDA4ODYxFQIAERgSOEJGRDZFQjM2RUYyMzE5NkJDAA==',
      events: [
        {
          id: 'wamid.HBgMNTg0MTI1NDA4ODYxFQIAERgSOEJGRDZFQjM2RUYyMzE5NkJDAA==',
          chatId: '584125408861@c.us',
          status: 'sent',
        },
        {
          id: 'wamid.HBgMNTg0MTI1NDA4ODYxFQIAERgSOEJGRDZFQjM2RUYyMzE5NkJDAA==',
          chatId: '584125408861@c.us',
          status: 'delivered',
        },
      ],
    },
    call: {
      response: {
        $metadata: {
          httpStatusCode: 200,
          requestId: '75b29013-26d8-447d-b202-76ac2e9dfdf7',
          attempts: 1,
          totalRetryDelay: 0,
        },
        ContactId: '9faeb1c4-0766-4553-a28e-d07a2f04eb5e',
        messageId: 'dd1d2027-a449-400a-8931-3a8fa8392bd8',
      },
      send: true,
      messageId: 'dd1d2027-a449-400a-8931-3a8fa8392bd8',
      events: [
        {
          Details: {
            ContactData: {
              Attributes: {
                date: '2025-11-05T22:58:26.625Z',
                voice: 'Lupe',
                dynamicMessage: 'Hola  giselle mendez romero!, te recordamos que tienes una cita con el hospital.',
                engine: 'neural',
                messageId: 'dd1d2027-a449-400a-8931-3a8fa8392bd8',
                style: 'conversational',
                locale: 'es-US',
              },
              AwsRegion: 'us-east-1',
              Channel: 'VOICE',
              ContactId: '9faeb1c4-0766-4553-a28e-d07a2f04eb5e',
              CustomerEndpoint: {
                Address: '+56966373189',
                Type: 'TELEPHONE_NUMBER',
              },
              CustomerId: null,
              Description: null,
              InitialContactId: '9faeb1c4-0766-4553-a28e-d07a2f04eb5e',
              InitiationMethod: 'API',
              InstanceARN: 'arn:aws:connect:us-east-1:885823782164:instance/e8f2f759-8bc3-453f-8ae7-a85343377bcc',
              LanguageCode: 'en-US',
              MediaStreams: {
                Customer: {
                  Audio: null,
                },
              },
              Name: null,
              PreviousContactId: '9faeb1c4-0766-4553-a28e-d07a2f04eb5e',
              Queue: null,
              References: {},
              RelatedContactId: null,
              SegmentAttributes: {
                'connect:Purpose': {
                  ValueArn: null,
                  ValueInteger: null,
                  ValueList: null,
                  ValueMap: {
                    'contact-attributes-search': {
                      ValueArn: null,
                      ValueInteger: null,
                      ValueList: null,
                      ValueMap: null,
                      ValueString: null,
                    },
                  },
                  ValueString: null,
                },
                'connect:Subtype': {
                  ValueArn: null,
                  ValueInteger: null,
                  ValueList: null,
                  ValueMap: null,
                  ValueString: 'connect:Telephony',
                },
              },
              SystemEndpoint: {
                Address: '+14237810504',
                Type: 'TELEPHONE_NUMBER',
              },
              Tags: {
                'aws:connect:instanceId': 'e8f2f759-8bc3-453f-8ae7-a85343377bcc',
                'aws:connect:systemEndpoint': '+14237810504',
              },
            },
            Parameters: {
              date: '2025-11-05T22:58:26.625Z',
              messageId: 'dd1d2027-a449-400a-8931-3a8fa8392bd8',
              event: 'call-start',
            },
          },
          Name: 'ContactFlowEvent',
          date: new Date('2025-11-05T22:58:40.874+0000'),
        },
        {
          Details: {
            ContactData: {
              Attributes: {
                date: '2025-11-05T22:58:26.625Z',
                voice: 'Lupe',
                dynamicMessage: 'Hola  giselle mendez romero!, te recordamos que tienes una cita con el hospital.',
                engine: 'neural',
                messageId: 'dd1d2027-a449-400a-8931-3a8fa8392bd8',
                style: 'conversational',
                locale: 'es-US',
              },
              AwsRegion: 'us-east-1',
              Channel: 'VOICE',
              ContactId: '9faeb1c4-0766-4553-a28e-d07a2f04eb5e',
              CustomerEndpoint: {
                Address: '+56966373189',
                Type: 'TELEPHONE_NUMBER',
              },
              CustomerId: null,
              Description: null,
              InitialContactId: '9faeb1c4-0766-4553-a28e-d07a2f04eb5e',
              InitiationMethod: 'API',
              InstanceARN: 'arn:aws:connect:us-east-1:885823782164:instance/e8f2f759-8bc3-453f-8ae7-a85343377bcc',
              LanguageCode: 'en-US',
              MediaStreams: {
                Customer: {
                  Audio: null,
                },
              },
              Name: null,
              PreviousContactId: '9faeb1c4-0766-4553-a28e-d07a2f04eb5e',
              Queue: null,
              References: {},
              RelatedContactId: null,
              SegmentAttributes: {
                'connect:Purpose': {
                  ValueArn: null,
                  ValueInteger: null,
                  ValueList: null,
                  ValueMap: {
                    'contact-attributes-search': {
                      ValueArn: null,
                      ValueInteger: null,
                      ValueList: null,
                      ValueMap: null,
                      ValueString: null,
                    },
                  },
                  ValueString: null,
                },
                'connect:ConnectionType': {
                  ValueArn: null,
                  ValueInteger: null,
                  ValueList: null,
                  ValueMap: null,
                  ValueString: 'PSTN',
                },
                'connect:Subtype': {
                  ValueArn: null,
                  ValueInteger: null,
                  ValueList: null,
                  ValueMap: null,
                  ValueString: 'connect:Telephony',
                },
              },
              SystemEndpoint: {
                Address: '+14237810504',
                Type: 'TELEPHONE_NUMBER',
              },
              Tags: {
                'aws:connect:instanceId': 'e8f2f759-8bc3-453f-8ae7-a85343377bcc',
                'aws:connect:systemEndpoint': '+14237810504',
              },
            },
            Parameters: {
              date: '2025-11-05T22:58:26.625Z',
              messageId: 'dd1d2027-a449-400a-8931-3a8fa8392bd8',
              event: 'call-finish',
            },
          },
          Name: 'ContactFlowEvent',
          date: new Date('2025-11-05T22:58:45.855+0000'),
        },
      ],
    },
  },
  success: true,
  createdAt: new Date('2025-09-05T16:34:59.434+0000'),
  updatedAt: new Date('2025-09-05T17:24:08.384+0000'),
  __v: 0,
};

export const notificationsAutomatizationLogMock = {
  stages: [
    notificationLogMock,
    notificationLogMock,
    notificationLogMock,
    notificationLogMock,
    notificationLogMock,
    notificationLogMock,
    notificationLogMock,
    notificationLogMock,
    notificationLogMock,
    notificationLogMock,
  ],
};

export const prescriptionMock = {
  ...mocks.prescriptionMock,
  patient: patientMock,
  practitioner: practitionerMock,
};
