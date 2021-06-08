$('#submit').on("click", function(e) {
	e.preventDefault();
	try {
		let data = context;

		let cardHolderName = document.getElementById('cardholder-name').value;
		let cardHolderEmail = document.getElementById('cardholder-email').value;
		let cardNumberWithSpaces = document.getElementById('card-number').value;
		let cardNumber = cardNumberWithSpaces.replace(/ /g,"");
		let expirationMonth = document.getElementById('card-expiry-month').value;
		let expirationYear = document.getElementById('card-expiry-year').value;
		let expirationDate = expirationYear.concat("-").concat(expirationMonth);
		let cardCode = document.getElementById('card-code').value;
		let isValidCard = frappe.cardValidator.number(cardNumber);

		if (!cardHolderName) {
			frappe.throw(__("Card Holder Name is mandatory."));
		}

		if (!cardHolderEmail) {
			frappe.throw(__("Card Holder Email is mandatory."));
		}
		
		if (!validate_email(cardHolderEmail)) {
			frappe.throw(__("Card Holder Email is invalid."));
		}

		if (!validate_email(cardHolderEmail)) {
			frappe.throw(__("Card Holder Email is invalid."));
		}

		if (!isValidCard.isPotentiallyValid) {
			frappe.throw(__("Card Number is Invalid."));
		}

		if(cardNumber.length < 13 || cardNumber.length > 16){
			frappe.throw(__("Card Number length should be between 13 and 16 characters"));
		}

		if(expirationMonth === "00" || expirationMonth.length !== 2 || expirationYear === "0000" || expirationYear.length !== 4){
			frappe.throw(__("Card Expiration Date is invalid"));
		}

		if(cardCode.length < 3 || cardCode.length > 4){
			frappe.throw(__("Card Code length should be between 3 and 4 characters"));
		}

		$('#submit').prop('disabled', true);
		$('#submit').html(__('Processing...'));

		frappe.call({
			method: "erpnext.erpnext_integrations.doctype.authorizenet_settings.authorizenet_settings.charge_credit_card",
			freeze: true,
			args: {
				"card_number": cardNumber,
				"expiration_date": expirationDate,
				"card_code": cardCode,
				"data": data
			},
			callback: function(r) {
				if (r.message.status === "Completed") {
					window.location.href = "/integrations/payment-success";
				} else {
					frappe.msgprint(__(`${r.message.description}`));
					$('#submit').prop('disabled', false);
					$('#submit').html(__('Retry'));
				}
			}
		});
	} catch(err) {
		console.error(err);
		e.preventDefault();
		return false;
	}
});

$('input[data-validation="digit"]')
	.on("paste", function(e) {
		if (e.originalEvent.clipboardData.getData('text').match(/[^\d]/))
			e.preventDefault(); //prevent the default behaviour
	})
	.keypress(function(event) {
		return (event.charCode !== 8 && event.charCode === 0 || (event.charCode >= 48 && event.charCode <= 57));
	});

$('#card-number').on('keydown', function () {
	var val = $(this).val();
	val = val.replace(/\s/g, '');
	let newval = val;
	if (val.match(/.{1,4}/g))
		newval = val.match(/.{1,4}/g).join(" ");
	$(this).val(newval);
});
