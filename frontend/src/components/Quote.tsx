const axios = require("axios").default;

export const Quote = () => {
  // Make a request for a user with a given ID
  axios({
    url: "http://localhost:5001/quote-api-8c2df/us-central1/APIFunctions/quotes/random",
    method: "get",
    headers: {
      api_key:
        "live_bmVbagbc5uMY2YwZNvB0TPvbrpfOYbOKqqDSKK1mvqUg9czWFEVLplH57Dpt3Ahy",
    },
  })
    .then(function (response: any) {
      // handle success
      console.log(response);
    })
    .catch(function (error: String) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

  // render data
  return <div>hello!</div>;
};
