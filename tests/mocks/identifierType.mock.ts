export const identifierTypeEcuadorMock = {
  _id: '60a090dc4bf088ced832a27a',
  active: true,
  coding: [
    {
      system: 'ISO 3166-1',
      version: 'Alpha-3',
      code: 'CHL',
    },
  ],
  text: 'personal_id.PID',
  displays: [
    {
      _id: '60a090dc4bf088ced832a27b',
      language: 'en',
      value: 'RUT',
      abbreviation: 'RUT',
    },
    {
      _id: '60a090dc4bf088ced832a27c',
      language: 'es',
      value: 'RUT',
      abbreviation: 'RUT',
    },
  ],
  acceptedCharacters: '0123456789kK.-',
  format: '000000000-0',
  createdAt: '2021-05-16T03:26:20.236Z',
  updatedAt: '2021-05-16T03:26:20.236Z',
  __v: 0,
  validations: [
    {
      values: ['identifier'],
      properties: ['identifier'],
      _function:
        "const breakIdentifier = identifier ? identifier.toString().toLowerCase().trim().split('-') : null;\n  const numberModule = 11;\n\n  if (breakIdentifier && breakIdentifier.length === 2) {\n    let index = 0;\n    let result = 0;\n    let indexMultiplier = 1;\n    const identifierNumber = breakIdentifier[0]\n      .toLowerCase()\n      .replace(/[^0-9k-]/gi, '')\n      .split('')\n      .map((number) => Number(number))\n      .filter((number) => !isNaN(number))\n      .reverse();\n    const verifiedDigit = breakIdentifier[1] === 'k' ? breakIdentifier[1] : Number(breakIdentifier[1]);\n\n    if (verifiedDigit !== 'k') {\n      if (isNaN(verifiedDigit)) {\n        return 'E2';\n      }\n\n      if (typeof verifiedDigit === 'number' && (verifiedDigit >= 10 || verifiedDigit < 0)) {\n        return 'E2';\n      }\n    }\n\n    while (index < identifierNumber.length) {\n      ++indexMultiplier;\n      const number = identifierNumber[index];\n      const numberMultiplier = number * indexMultiplier;\n      result += numberMultiplier;\n      if (indexMultiplier === 7) {\n        indexMultiplier = 1;\n      }\n      ++index;\n    }\n    const firstStageResult = Math.trunc(result / numberModule);\n    const secondStageResult = firstStageResult * numberModule;\n    const thirdStageResult = result - secondStageResult;\n\n    let finalStage = numberModule - thirdStageResult;\n\n       if (finalStage === 10) {\n      finalStage = 'k';\n    }\n    if (finalStage === 11) {\n      finalStage = 0;\n    }\n\n    return finalStage === verifiedDigit;\n  } else {\n    return 'E1';\n  }",
      errors: [
        {
          displays: [
            {
              language: 'es',
              value: 'Número de rut inválido',
            },
            {
              language: 'en',
              value: 'Invalid rut identifier',
            },
          ],
          text: 'E1',
        },
        {
          displays: [
            {
              language: 'es',
              value: 'Número verificador invalido',
            },
            {
              language: 'en',
              value: 'Verified number invalid',
            },
          ],
          text: 'E2',
        },
        {
          displays: [
            {
              language: 'es',
              value: 'Número de provincias inválido',
            },
            {
              language: 'en',
              value: 'Invalid province number',
            },
          ],
          text: 'E3',
        },
      ],
    },
  ],
  msgSuccess: [
    {
      language: 'es',
      value: 'Rut es valido',
      _id: '63b7292e044d49b05488420a',
    },
    {
      language: 'en',
      value: 'Rut Valid',
      _id: '63b7293f044d49b05488420b',
    },
  ],
  msgInvalid: [
    {
      language: 'es',
      value: 'El rut es inválido. Por favor verifique nuevamente',
    },
    {
      language: 'en',
      value: 'Invalid rut. Please verfied',
    },
  ],
};
