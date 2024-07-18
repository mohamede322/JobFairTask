$(async () => {
  const baseURL = "http://localhost:3000/";
  const myData = $("#myData");

  async function getData(x) {
    let response = await fetch(baseURL + x);
    let data = await response.json();
    return data;
  }

  let customers = await getData("customers");
  let transcations = await getData("transactions");

  let filteredCustomers = customers;
  let filteredTranscations = transcations;

  $("#filterName").on("input", (e) => {
    let inputValue = $(e.currentTarget).val().toLowerCase();
    filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(inputValue)
    );
    DisplayData(filteredCustomers, filteredTranscations);
  });
  $("#filterAmount").on("input", (e) => {
    let inputValue = $(e.currentTarget).val();
    filteredTranscations = transcations.filter((transcation) =>
      transcation.amount.toString().includes(inputValue)
    );
    DisplayData(filteredCustomers, filteredTranscations);
  });

  DisplayData(customers, transcations);
  function DisplayData(customers, transcations) {
    let content = `<tr class=" border-top border-bottom text-black-50 fw-semibold">
          <th class="py-3 text-primary ps-3">DATE</th>
          <th class="py-3 text-primary">NAME</th>
          <th class="py-3 text-primary">AMOUNT</th>
        </tr>`;

    transcations.map((transcation) => {
      customers.filter((customer) => {
        customer.id == transcation.customer_id
          ? (content += `
      <tr class=" table-content  border-top border-bottom text-muted" data-customerID="${customer.id}">
       <td class="py-3 ps-3 fw-semibold text-dark">${transcation.date}</td>
        <td class="py-3 text-dark">${customer.name}</td>
       
        <td class="py-3 fw-semibold text-dark">$${transcation.amount}</td>
      </tr>`)
          : "";
      });
    });

    myData.html(content);
    $(".table-content").on("click", (e) => {
      let currentEle = $(e.currentTarget);
      let id = currentEle.attr("data-customerID");
      $(".table-content").removeClass("selected");
      currentEle.addClass("selected");
      $("#myChart").removeClass("d-none");
      createGraph(id);
    });
  }

  let myLineChart;
  function createGraph(id) {
    let selectedTranscation = transcations.filter(
      (transcation) => transcation.customer_id == id
    );
    let customerName = customers.filter((customer) => customer.id == id)[0]
      .name;
    const ctx = $("#myChart");
    let config = {
      type: "line",
      data: {
        labels: selectedTranscation.map((transcation) => transcation.date),
        datasets: [
          {
            label: `${customerName}'s Transactions`,
            data: selectedTranscation.map((transcation) => transcation.amount),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    };

    if (myLineChart) {
      myLineChart.destroy();
      myLineChart = new Chart(ctx, config);
    } else {
      myLineChart = new Chart(ctx, config);
    }
  }
});
