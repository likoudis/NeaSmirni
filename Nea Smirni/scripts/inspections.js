		var categoryID = null;
	
		var splitViewCategories = new kendo.data.DataSource({
			type: "odata",
			transport: {
				read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Categories"
			}
		});
	
		var splitViewProducts = new kendo.data.DataSource({
			type: "odata",
			serverFiltering: true,
	
			transport: {
				read: {
					url: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Products"
				}
			}
		});
	
		var splitViewOrderDetails = new kendo.data.DataSource({
			type: "odata",
			serverFiltering: true,
			transport: {
				read: {
					url: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Order_Details?$expand=Order"
				}
			},
	
			change: function() {
				var template = kendo.template($("#ordersTemplate").text());
				$("#product-details").html(kendo.render(template, this.data()));
			}
		});
	
		function displayOrder(e) {
			splitViewOrderDetails.filter({
				field: "ProductID",
				operator: "eq",
				value: parseInt(e.view.params.ProductID)
			});
	
			splitViewOrderDetails.read();
		}
	
		function filterProducts(e) {
			splitViewProducts.filter({
				field: "CategoryID",
				operator: "eq",
				value: parseInt(e.view.params.CategoryID)
			});
	
			splitViewProducts.read();
		}
	
		function toggleBackButton(e) {
			if (e.view.id === "#side-root") {
				e.view.element.find("[data-role=backbutton]").css("visibility", "hidden");
			} else {
				e.view.element.find("[data-role=backbutton]").css("visibility", "visible");
			}
		}