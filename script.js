
const $ = (id) => document.getElementById(id);

function money(number) {
  return Math.round(number).toLocaleString("uz-UZ") + " so‘m";
}

// FOYDA KALKULYATORI
function calculateProfit() {
  const sell = Number($("sellPrice").value);
  const buy = Number($("buyPrice").value);
  const commission = Number($("commission").value);
  const delivery = Number($("delivery").value);
  const tax = Number($("tax").value);

  if (
    ![sell, buy, commission, delivery, tax].every(Number.isFinite) ||
    sell <= 0 || buy < 0 ||
    commission < 0 || commission > 100 ||
    delivery < 0 || tax < 0 || tax > 100
  ) {
    alert("Ma’lumotlarni to‘g‘ri kiriting.");
    return;
  }

  const profit = sell - buy
    - sell * commission / 100
    - delivery
    - sell * tax / 100;

  const margin = profit / sell * 100;

  $("profitResult").textContent = money(profit);
  $("profitResult").style.color =
    profit >= 0 ? "#F5B700" : "#FF8585";

  $("marginResult").textContent =
    "Marja: " + margin.toFixed(1) + "%";
}

$("calculateButton").addEventListener("click", calculateProfit);
calculateProfit();

// MAHSULOTLAR
let products = [];

try {
  products = JSON.parse(localStorage.getItem("foydamProducts")) || [];
  if (!Array.isArray(products)) products = [];
} catch (error) {
  products = [];
}

function saveProducts() {
  try {
    localStorage.setItem("foydamProducts", JSON.stringify(products));
  } catch (error) {
    alert("Ma’lumotni saqlab bo‘lmadi.");
  }
}

function renderProducts() {
  const list = $("productList");
  list.innerHTML = "";

  let stockValue = 0;
  let possibleProfit = 0;

  products.forEach((product, index) => {
    stockValue += product.buy * product.stock;
    possibleProfit += (product.sell - product.buy) * product.stock;

    const tr = document.createElement("tr");

    [product.name, money(product.buy), money(product.sell), product.stock]
      .forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });

    const action = document.createElement("td");
    const button = document.createElement("button");

    button.textContent = "O‘chirish";
    button.className = "delete-button";

    button.addEventListener("click", () => {
      products.splice(index, 1);
      saveProducts();
      renderProducts();
    });

    action.appendChild(button);
    tr.appendChild(action);
    list.appendChild(tr);
  });

  $("productCount").textContent = products.length;
  $("stockValue").textContent = money(stockValue);
  $("possibleProfit").textContent = money(possibleProfit);

  $("emptyMessage").style.display =
    products.length === 0 ? "block" : "none";
}

// YANGI MAHSULOT QO‘SHISH
$("addProductButton").addEventListener("click", () => {
  const name = $("productName").value.trim();
  const buyText = $("productBuy").value.trim();
  const sellText = $("productSell").value.trim();
  const stockText = $("productStock").value.trim();

  const buy = Number(buyText);
  const sell = Number(sellText);
  const stock = Number(stockText);

  if (
    !name || !buyText || !sellText || !stockText ||
    !Number.isFinite(buy) ||
    !Number.isFinite(sell) ||
    !Number.isFinite(stock) ||
    buy < 0 || sell <= 0 ||
    stock < 0 || !Number.isInteger(stock)
  ) {
    $("formMessage").textContent =
      "Barcha maydonlarni to‘g‘ri to‘ldiring.";
    return;
  }

  products.push({ name, buy, sell, stock });

  saveProducts();
  renderProducts();

  $("productName").value = "";
  $("productBuy").value = "";
  $("productSell").value = "";
  $("productStock").value = "";

  $("formMessage").textContent =
    "Mahsulot muvaffaqiyatli qo‘shildi.";
});

renderProducts();
