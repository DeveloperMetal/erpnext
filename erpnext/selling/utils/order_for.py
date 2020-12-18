import frappe
from frappe import _dict
from erpnext.shopping_cart.cart import get_party

def on_session_start():
	"""Initializes the "order for" feature which allows a backend user to use the
	shopping cart in behalf of another user"""

	# Initialize frappe.session.data.order_for
	if "order_for" not in frappe.session.data:
		frappe.session.data["order_for"] = _dict({})

	order_for = frappe.session.data.order_for

	# Keep customer info up to date on every session start
	customer = get_party()
	if customer and customer.doctype == "Customer":
		# no reason to set customer_name again as get_party expects
		# customer_name to exists to set user from the "order for" feature
		# otherwise vanilla path is executed a the true customer is returned.
		if order_for.get("customer_name"):
			order_for.set("customer_name", customer.name)

		order_for.set("customer_group", customer.customer_group)

