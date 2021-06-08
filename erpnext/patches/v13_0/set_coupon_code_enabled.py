import frappe

def execute():
	# Default existing coupons to enabled
	frappe.db.sql("UPDATE `tabCoupon Code` SET enabled = 1")
