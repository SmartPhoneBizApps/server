const asyncHandler = require("../../middleware/async");
const request = require("request");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)

// var aa = new calfunction();
// console.log(aa.Handler[ADD1()]);
// return false;

exports.nhsfindPatient = asyncHandler(async (req, res, next) => {
  outData = [];
  request(
    {
      method: "GET",
      url:
        "https://orange.testlab.nhs.uk/gpconnect-demonstrator/v1/fhir/Patient?identifier=https://fhir.nhs.uk/Id/nhs-number|9658218873",
      json: true,
      headers: {
        Accept: "application/fhir+json",
        "Ssp-From": "200000000359",
        "Ssp-To": "918999198993",
        "Ssp-InteractionID":
          "urn:nhs:names:services:gpconnect:fhir:rest:search:patient-1",
        "Ssp-TraceID": "12547852",
        Authorization:
          "Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJpc3MiOiJodHRwOi8vZ3Bjb25uZWN0LXBvc3RtYW4tdXJsIiwic3ViIjoiMSIsImF1ZCI6Imh0dHBzOi8vb3JhbmdlLnRlc3RsYWIubmhzLnVrL2dwY29ubmVjdC1kZW1vbnN0cmF0b3IvdjEvZmhpciIsImV4cCI6MTU5MjkxMjk0NiwiaWF0IjoxNTkyOTEyNjQ2LCJyZWFzb25fZm9yX3JlcXVlc3QiOiJkaXJlY3RjYXJlIiwicmVxdWVzdGVkX3Njb3BlIjoicGF0aWVudC8qLnJlYWQiLCJyZXF1ZXN0aW5nX2RldmljZSI6eyJyZXNvdXJjZVR5cGUiOiJEZXZpY2UiLCJpZCI6IjEiLCJpZGVudGlmaWVyIjpbeyJzeXN0ZW0iOiJXZWIgSW50ZXJmYWNlIiwidmFsdWUiOiJQb3N0bWFuIGV4YW1wbGUgY29uc3VtZXIifV0sIm1vZGVsIjoiUG9zdG1hbiIsInZlcnNpb24iOiIxLjAifSwicmVxdWVzdGluZ19vcmdhbml6YXRpb24iOnsicmVzb3VyY2VUeXBlIjoiT3JnYW5pemF0aW9uIiwiaWRlbnRpZmllciI6W3sic3lzdGVtIjoiaHR0cHM6Ly9maGlyLm5ocy51ay9JZC9vZHMtb3JnYW5pemF0aW9uLWNvZGUiLCJ2YWx1ZSI6IkdQQzAwMSJ9XSwibmFtZSI6IlBvc3RtYW4gT3JnYW5pemF0aW9uIn0sInJlcXVlc3RpbmdfcHJhY3RpdGlvbmVyIjp7InJlc291cmNlVHlwZSI6IlByYWN0aXRpb25lciIsImlkIjoiMSIsImlkZW50aWZpZXIiOlt7InN5c3RlbSI6Imh0dHBzOi8vZmhpci5uaHMudWsvSWQvc2RzLXVzZXItaWQiLCJ2YWx1ZSI6IkcxMzU3OTEzNSJ9LHsic3lzdGVtIjoiaHR0cHM6Ly9maGlyLm5ocy51ay9JZC9zZHMtcm9sZS1wcm9maWxlLWlkIiwidmFsdWUiOiIxMTExMTExMTEifV0sIm5hbWUiOlt7ImZhbWlseSI6IkRlbW9uc3RyYXRvciIsImdpdmVuIjpbIkdQQ29ubmVjdCJdLCJwcmVmaXgiOlsiTXIiXX1dfX0.",
      },
    },

    function (error0, response0, body0) {
      console.log(body0);

      res.status(201).json({
        success: true,
        data: body0,
      });
    }
  );
});
