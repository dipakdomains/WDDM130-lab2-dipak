// running totals
let purchaseCount = 0;
let totalTicketsSold = 0;
let vipTicketsSold = 0;
let grandTotal = 0;

const prices = { REG: 12.50, STU: 9.00, VIP: 25.00 };

function $(id) { return document.getElementById(id); }
function money(n) { return "$" + n.toFixed(2); }

function addPurchase() {
    const type = $("ticketType").value;
    const qtyRaw = $("quantity").value.trim();
    const promo = $("promoCode").value.trim().toUpperCase();

    // validation using do-while
    const errors = [];
    const checks = [
        { fail: type === "",                                          msg: "Please select a ticket type." },
        { fail: qtyRaw === "",                                        msg: "Quantity cannot be blank." },
        { fail: qtyRaw !== "" && (!/^\d+$/.test(qtyRaw) || +qtyRaw < 1), msg: "Quantity must be a whole number of at least 1." }
    ];

    let i = 0;
    do {
        if (checks[i].fail) errors.push(checks[i].msg);
        i++;
    } while (i < checks.length);

    if (errors.length > 0) {
        $("errorArea").innerHTML = `<div class="error-box">${errors.join("<br>")}</div>`;
        return;
    }

    $("errorArea").innerHTML = "";

    const qty = +qtyRaw;
    const price = prices[type];
    const subtotal = price * qty;

    const discount = qty >= 5 ? subtotal * 0.10 : 0;
    const afterDiscount = subtotal - discount;

    const vipFee = (type === "VIP" && qty >= 2) ? 5.00 : 0;
    const afterFee = afterDiscount + vipFee;

    const promoSave = promo === "SAVE5" ? Math.min(5, afterFee) : 0;
    const beforeTax = afterFee - promoSave;

    const tax = beforeTax * 0.13;
    const total = beforeTax + tax;

    // update totals
    purchaseCount++;
    totalTicketsSold += qty;
    if (type === "VIP") vipTicketsSold += qty;
    grandTotal += total;

    // build receipt
    const label = type + " Ticket" + (qty > 1 ? "s" : "");
    let html = `
        <div class="receipt">
            <h3>Receipt #${purchaseCount}</h3>
            <table>
                <tr><td>${label}</td><td>${qty} x ${money(price)}</td></tr>
                <tr><td>Sub Total</td><td>${money(subtotal)}</td></tr>`;

    if (discount > 0)  html += `<tr><td>Discount</td><td>-${money(discount)}</td></tr>`;
    if (vipFee > 0)    html += `<tr><td>VIP Service Fee</td><td>${money(vipFee)}</td></tr>`;
    if (promoSave > 0) html += `<tr><td>Promo (SAVE5)</td><td>-${money(promoSave)}</td></tr>`;

    html += `
                <tr><td>Sub Total after Discount/Promos</td><td>${money(beforeTax)}</td></tr>
                <tr><td>Taxes (13%)</td><td>${money(tax)}</td></tr>
                <tr class="total-row"><td>Total</td><td>${money(total)}</td></tr>
            </table>
        </div>`;

    if (purchaseCount === 1) {
        $("receiptArea").innerHTML = html;
    } else {
        $("receiptArea").innerHTML += html;
    }

    // clear inputs
    $("ticketType").value = "";
    $("quantity").value = "";
    $("promoCode").value = "";
}

function showSummary() {
    if (purchaseCount === 0) {
        $("summaryArea").innerHTML = "<p class='muted'>Add a purchase first.</p>";
        return;
    }

    $("summaryArea").innerHTML = `
        <div class="summary">
            <div class="summary-row"><span>Purchases</span><span>${purchaseCount}</span></div>
            <div class="summary-row"><span>Total Tickets Sold</span><span>${totalTicketsSold}</span></div>
            <div class="summary-row"><span>VIP Tickets Sold</span><span>${vipTicketsSold}</span></div>
            <div class="summary-row"><span>Grand Total (incl. tax)</span><span>${money(grandTotal)}</span></div>
        </div>`;
}

$("btnAdd").addEventListener("click", addPurchase);
$("btnSummary").addEventListener("click", showSummary);
