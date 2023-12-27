let queue = [];
const maxCustomers = 101;
let currentCustomerNumber = 1;
let tellerCount = 6;
let currentTeller = 1;

function removeCustomerByIndex(index) {
  const customerToRemove = queue[index];

  // Log the removal
  console.log(`Removing ${customerToRemove.code} - ${customerToRemove.name}`);

  // Remove the customer from the queue array
  queue.splice(index, 1);

  // Update the queue display
  updateQueueDisplay();

  // Remove customer from teller and monitor displays if present
  const tellers = document.querySelectorAll(".tellerContent");
  tellers.forEach((teller) => {
    if (teller.textContent.includes(customerToRemove.code)) {
      teller.remove();
    }
  });

  const monitorContent = document.getElementById("monitorContent");
  if (monitorContent.textContent.includes(customerToRemove.code)) {
    monitorContent.textContent = "No customer being served currently.";
  }
}

function removeCustomer(customerToRemove) {
  // Log the removal
  console.log(`Removing ${customerToRemove.code} - ${customerToRemove.name}`);

  // Remove customer from the queue array
  queue = queue.filter((customer) => customer !== customerToRemove);

  // Update the queue display
  updateQueueDisplay();

  // Remove customer from teller and monitor displays if present
  const tellers = document.querySelectorAll(".tellerContent");
  tellers.forEach((teller) => {
    if (teller.textContent.includes(customerToRemove.code)) {
      teller.remove();
    }
  });

  const monitorContent = document.getElementById("monitorContent");
  if (monitorContent.textContent.includes(customerToRemove.code)) {
    monitorContent.textContent = "No customer being served currently.";
  }
}

// Function to update the display of the queue
function updateQueueDisplay() {
  const customerQueue = document.getElementById("customerQueue");
  customerQueue.innerHTML = "";
  queue.forEach((customer, index) => {
    const listItem = document.createElement("li");

    // Create a span for customer details
    const customerDetails = document.createElement("span");
    customerDetails.textContent = `${customer.code} - ${customer.name} `;

    // If customer has priority, add a "Priority" label
    if (customer.priority) {
      const priorityLabel = document.createElement("span");
      priorityLabel.textContent = " - Priority";
      priorityLabel.style.color = "red"; // Change the color as needed
      priorityLabel.style.marginLeft = "5px"; // Add space between name and label
      customerDetails.appendChild(priorityLabel);
    }
    // Create the 'X' button for removal
    const removeButton = document.createElement("button");
    removeButton.textContent = "X";
    removeButton.style.marginLeft = "5px"; // Add some space between the name and the 'X' button
    removeButton.addEventListener("click", () => removeCustomerByIndex(index));
    
    // Create the 'Mark Priority' button for each customer
    const markPriorityButton = document.createElement("button");
    markPriorityButton.textContent = "Mark Priority";
    markPriorityButton.style.marginLeft = "5px";
    markPriorityButton.addEventListener("click", () => togglePriority(index));

    // Append the customer details and the 'X' button to the list item
    listItem.appendChild(customerDetails);
    listItem.appendChild(removeButton);
    listItem.appendChild(markPriorityButton);

    // Append the list item to the queue
    customerQueue.appendChild(listItem);
  });
}
function addCustomer(event) {
  event.preventDefault();
  const customerName = document.getElementById("customerName").value.trim();

  if (!customerName) {
    alert("Please enter a name.");
    return;
  }

  if (queue.length >= maxCustomers) {
    alert("Queue is full!");
    return;
  }

  const servingCustomers = queue.filter((customer) => !customer.served);
  console.log("Serving Customers:", servingCustomers.length); // Log serving customers count

  if (servingCustomers.length >= tellerCount) {
    alert("All tellers are currently serving customers. Please wait.");
    return;
  }

  const customer = {
    code: `A-${String(currentCustomerNumber).padStart(3, "0")}`,
    name: customerName,
    priority: false,
    arrivalTime: new Date().toLocaleTimeString(),
  };

  queue.push(customer);
  updateQueueDisplay();
  document.getElementById("customerForm").reset();

  if (queue.length === 1) {
    assignCustomerToTeller();
  }

  currentCustomerNumber++;
}

function resetQueue() {
  queue = [];
  currentCustomerNumber = 1;
  updateQueueDisplay();

  // Clear monitor content
  const monitorContent = document.getElementById("monitorContent");
  monitorContent.innerHTML = "No customer being served currently.";

  // Remove customer names from tellers
  const tellers = document.querySelectorAll(".tellerContent");
  tellers.forEach((teller) => teller.remove());

  // Reset currentTeller to 1
  currentTeller = 1;
}

document.getElementById("customerForm").addEventListener("submit", addCustomer);

// Reset Button
document
  .getElementById("resetButton")
  .addEventListener("click", function (event) {
    event.preventDefault();
    resetQueue();
  });

function markCustomerDone(tellerNumber) {
  const tellerContent = document.querySelector(
    `.tellers .teller:nth-child(${tellerNumber}) .tellerContent`
  );
  if (tellerContent) {
    tellerContent.classList.add("done");
  }
}

function assignCustomerToTeller() {
  if (queue.length > 0) {
    const servingCustomer = queue.find((customer) => !customer.served);

    // Add assignedTeller property to the customer object
    servingCustomer.assignedTeller = `Teller ${currentTeller}`;

    if (servingCustomer) {
      const tellerContent = document.createElement("div");
      tellerContent.className = "tellerContent";
      tellerContent.textContent = `Teller ${currentTeller}: Serving ${servingCustomer.code} - ${servingCustomer.name}`;
      document
        .querySelector(`.tellers .teller:nth-child(${currentTeller})`)
        .appendChild(tellerContent);

      updateMonitor(servingCustomer);
      servingCustomer.served = true;

      currentTeller = (currentTeller % tellerCount) + 1; // Move to the next teller
    }
  }
}

function updateMonitor(customer) {
  const monitorContent = document.getElementById("monitorContent");
  monitorContent.innerHTML = ""; // Clear previous content

  const customerDiv = document.createElement("div");
  customerDiv.textContent = `Serving ${customer.code} - ${customer.name}`;
  monitorContent.appendChild(customerDiv);

  const tellerDiv = document.createElement("div");
  tellerDiv.textContent = `Assigned Teller: ${customer.assignedTeller}`;
  monitorContent.appendChild(tellerDiv);
}

function removeCustomer(customerToRemove) {
  queue = queue.filter((customer) => customer !== customerToRemove);
  updateQueueDisplay();
}

document.getElementById("customerForm").addEventListener("submit", addCustomer);

// Code for dynamically adding tellers
const tellersContainer = document.querySelector(".tellers");
for (let i = 1; i <= tellerCount; i++) {
  const tellerDiv = document.createElement("div");
  tellerDiv.className = "teller";
  tellerDiv.innerHTML = `<h2>Teller ${i}</h2>`;
  tellersContainer.appendChild(tellerDiv);
}
setInterval(assignCustomerToTeller, 5000);
// Automatic serving every 5 seconds (for demonstration)
function updateDateTime() {
  const dateInfo = document.getElementById("dateInfo");
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = now.toLocaleDateString("en-US", options);
  const time = now.toLocaleTimeString("en-US");
  dateInfo.textContent = `Date: ${formattedDate} | Time: ${time}`;
}
function togglePriority(customerIndex) {
  const customer = queue[customerIndex];
  customer.priority = !customer.priority;

  // Update the queue display after toggling priority
  updateQueueDisplay();
}

// Call the function once on load
updateDateTime();

// Update the time every second
setInterval(updateDateTime, 1000);

// Clock
