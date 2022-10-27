import router from "@/router";
import axios from "axios";
import swal from "sweetalert";

const instance = axios.create({
    baseURL: "https://tradeproject.crud.uz/",
    headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
    }
});

export function success(index) {
    if (index !== undefined) {
        document.querySelectorAll("[data-dismiss]")[index].click()
    }
    return swal({
        icon: "success",
        timer: 800,
        closeOnEsc: false,
        closeOnClickOutside: false,
    })
}

export function catchError(error) {
    console.error(error);
    if (error.response.status == 401) {
        swal({
            icon: "warning",
            title: "Ism yoki parolda xatolik !",
            timer: 2000
        }).then(() => {
            localStorage.clear()
            if (location.pathname !== "/") {
                router.push("/")
            }
        })
    } else if (error.response.status == 400) {
        swal({
            icon: "warning",
            title: error.response.data.detail,
            timer: 2500
        })
    } else if (error.response.status == 404) {
        swal({
            icon: "warning",
            title: "URL manzili noto'g'ri !",
            timer: 2000,
        })
    } else if (error.response.status == 422) {
        swal({
            icon: "warning",
            title: "Ma'lumotlar to'liq emas !",
            timer: 2000,
        })
    } else if (error.message == "Network Error") {
        swal({
            icon: "warning",
            title: "Server bilan aloqa mavjud emas !",
            timer: 2000,
        })
    }
}

// token

export function login(data) {
    let params = new URLSearchParams();

    params.append("username", data.username);
    params.append("password", data.password);

    return instance
        .post("token", params)
}

// branch

export function branches() {
    return instance
        .get("get_branches")
}
export function branch(id) {
    return instance
        .get("get_branch/" + id)
}
export function createBranch(data) {
    return instance
        .post(`create_branch`, data)
}
export function updateBranch(data) {
    return instance
        .put(`update_branch/${data.id}`, data)
}
export function createLogo(data, image) {
    return instance
        .post(`create_logo/${data.id}`, image)
}
export function removeLogo(id) {
    return instance
        .delete(`remove_logo/${id}`)
}

// users

export function thisUser(id) {
    return instance
        .get(`this_user/${id}`)
}
export function user() {
    return instance
        .get("get_user")
}
export function users(id, page, limit) {
    return instance
        .get(`get_users/?branch_id=${id}&?page=${page}&limit=${limit}`)
}
export function createUser(data) {
    return instance
        .post("create_user", data)
}
export function updateUser(data) {
    return instance
        .put(`update_user/${data.id}`, data)
}

// customer

export function customer(id) {
    return instance
        .get(`this_customer/${id}`)
}
export function customers(page, limit, search) {
    if (search) {
        return instance
            .get(`get_customers?search=${search}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_customers?page=${page}&limit=${limit}`)
    }
}
export function createCustomer(data) {
    return instance
        .post("customer_create", data)
}
export function updateCustomer(data) {
    return instance
        .put("update_customer/" + data.id, data)
}

// loan

export function loan(id) {
    return instance
        .get(`get_customer_loan/${id}`)
}
export function orderLoan(order_id, loan_id) {
    return instance
        .get(`get_loan?order_id=${order_id}&loan_id=${loan_id}`)
}
export function loans(status, id, page, limit) {
    return instance
        .get(`get_loans/${status}?customer_id=${id}&page=${page}&limit=${limit}`)
}
export function takeLoan(id, price, type) {
    return instance
        .post(`take_loan/${id}?money=${price}&type=${type}`)
}

// income

export function incomes(id, status, page, limit) {
    return instance
        .get(`get_incomes/${id}/${status}?page=${page}&limit=${limit}`)
}

// market

export function market(id) {
    return instance
        .get(`this_market/${id}`)
}
export function markets(page, limit) {
    return instance
        .get("get_markets?page=" + page + "&limit=" + limit)
}
export function createMarket(data) {
    return instance
        .post("create_market", data)
}
export function updateMarket(data) {
    return instance
        .put("update_market/" + data.id, data)
}
export function takeIncomeFromMarket(data) {
    return instance
        .post(`take_income_from_market`, data)
}
export function marketBalance(id) {
    return instance
        .get(`market_sum_price/${id}`)
}

// warehouse

export function warehouse(id) {
    return instance
        .get(`this_warehouse/${id}`)
}
export function warehouses() {
    return instance
        .get("get_warehouses")
}

export function createWarehouse(data) {
    return instance
        .post("create_warehouse", data)
}

export function updateWarehouse(data) {
    return instance
        .put("update_warehouse/" + data.id, data)
}
export function warehouseBalances(id) {
    return instance
        .get(`warehouse_products_sum_price/${id}`)
}
export function warehouseProducts(id, category_id, page, limit, status) {
    if (category_id) {
        return instance
            .get(`get_warehouse_products/${id}?category_id=${category_id}&group=${status}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_warehouse_products/${id}?group=${status}&page=${page}&limit=${limit}`)
    }
}
export function removeWarehouseProduct(product_id, quantity) {
    return instance
        .delete(`remove_w_product/${product_id}/${quantity}`)
}

// transfer

export function transfers(id, status, page, limit, branch_id, from_time, to_time) {
    if (from_time && to_time) {
        return instance
            .get(`get_transfers?warehouse_id=${id}&status=${status}&branch_id=${branch_id}&from_time=${from_time}&to_time=${to_time}&page=${page}&limit${limit}`)
    } else {
        return instance
            .get(`get_transfers?warehouse_id=${id}&status=${status}&branch_id=${branch_id}&page=${page}&limit${limit}`)
    }
}
export function transferProduct(id, data) {
    return instance
        .post(`transfer_product/${id}`, data)
}
export function removeTransfer(transfer_id) {
    return instance
        .delete(`remove_transfer/${transfer_id}`)
}
export function acceptTransfer(id, data) {
    return instance
        .post(`acceptance_product/${id}`, data)
}

// currency

export function currencies() {
    return instance
        .get("get_currencies")
}
export function createCurrency(data) {
    return instance
        .post(`create_currency`, data)
}
export function updateCurrency(data) {
    return instance
        .put("update_currency/" + data.id, data)
}

// category

export function categories(id, page, limit) {
    return instance
        .get(`get_categories?category_id=${id}&page=${page}&limit=${limit}`)
}
export function createCategory(data) {
    return instance
        .post("create_category", data)
}
export function updateCategory(data) {
    return instance
        .put("update_category/" + data.id, data)
}

// product

export function productsForTrade(code, page, limit) {
    return instance
        .get(`get_products_for_trade/${code}?page=${page}&limit=${limit}`)
}
export function addProducts(data) {
    return instance
        .post(`add_product`, data)
}
export function updateProduct(code, size, data) {
    return instance
        .put(`update_product/${code}/${size}`, data)
}
export function productHistory(warehouse_id, category_id, articul) {
    return instance
        .get(`get_supplies_party/${warehouse_id}/${category_id}/${articul}`)
}
export function productsSumPrice() {
    return instance
        .get(`products_sum_price`)
}

// photo

export function photo(articul) {
    return instance
        .get(`get_photos/${articul}`)
}
export function uploadPhoto(articul, file) {
    return instance
        .post(`upload_photo/${articul}`, file)
}
export function removePhoto(articul, id) {
    return instance
        .delete(`remove_photo/${articul}/${id}`)
}

// order

export function order(id) {
    return instance
        .get(`get_this_order/${id}`)
}
export function orders(from_time, to_time, status, id, page, limit) {
    if (from_time && to_time) {
        return instance
            .get(`get_orders?from_time=${from_time}&to_time=${to_time}&status=${status}&seller_id=${id}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_orders?status=${status}&seller_id=${id}&page=${page}&limit=${limit}`)
    }
}
export function customerOrders(customer_id, from_time, to_time, page, limit) {
    if (from_time && to_time) {
        return instance
            .get(`get_orders_customer/${customer_id}?from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_orders_customer/${customer_id}?page=${page}&limit=${limit}`)
    }
}
export function createOrder() {
    return instance
        .post(`create_order`)
}
export function removeOrder(id) {
    return instance
        .delete(`remove_order/${id}`)
}
export function confirmationOrder(id, data) {
    return instance
        .put(`order_confirmation/${id}`, data)
}

// trade

export function trades(id, page, limit) {
    return instance
        .get(`get_trades/${id}?page=${page}&limit=${limit}`)
}
export function toTrade(data) {
    return instance
        .post(`to_trade`, data)
}
export function updateTrade(status, data) {
    return instance
        .put(`update_trade/${status}`, data)
}
export function tradeBalance(id) {
    return instance
        .get(`get_trade_balance/${id}`)
}

// return

export function returnedProducts(id, page, limit) {
    return instance
        .get(`get_returned_products?order_id=${id}&page=${page}&limit=${limit}`)
}
export function returnProduct(id, data) {
    return instance
        .put(`return_product/${id}`, data)
}

// party

export function parties(status, page, limit) {
    return instance
        .get(`get_parties?status=${status}&page=${page}&limit=${limit}`)
}
export function createParty() {
    return instance
        .post("create_party")
}
export function confirmationParty(party_id, warehouse_id, currency_id, to_branch) {
    return instance
        .post(`confirmation_party/${party_id}/${warehouse_id}/${currency_id}?to_branch=${to_branch}`)
}
export function partyBalances(id) {
    return instance
        .get(`get_party_balances/${id}`)
}

// supply

export function supplies(market_id, party_id, page, limit, from_time, to_time) {
    if (market_id && !party_id) {
        if (from_time && to_time) {
            return instance
                .get(`get_supplies?from_time=${from_time}&to_time=${to_time}&market_id=${market_id}&page=${page}&limit=${limit}`)
        } else {
            return instance
                .get(`get_supplies?market_id=${market_id}&page=${page}&limit=${limit}`)
        }
    } else if (!market_id && party_id) {
        return instance
            .get(`get_supplies?party_id=${party_id}&page=${page}&limit=${limit}`)
    } else if (market_id && party_id) {
        return instance
            .get(`get_supplies?market_id=${market_id}&party_id=${party_id}&page=${page}&limit=${limit}`)
    }
}
export function takeSupply(data) {
    return instance
        .post("take_supply", data)
}
export function removeSupply(id) {
    return instance
        .delete(`remove_supply/${id}`)
}

// expense

export function fixedExpenses() {
    return instance
        .get("get_fixed_expenses")
}
export function variableExpenses(page, limit, from_time, to_time) {
    if (from_time && to_time) {
        return instance
            .get(`get_variable_expenses?from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_variable_expenses?page=${page}&limit=${limit}`)
    }
}
export function fixedExpense(page, limit, id, from_time, to_time) {
    if (from_time && to_time) {
        return instance
            .get(`fixed_expenses_get?from_time=${from_time}&to_time=${to_time}&fixed_expense_id=${id}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`fixed_expenses_get?fixed_expense_id=${id}&page=${page}&limit=${limit}`)
    }
}
export function partyExpenses(id, page, limit) {
    return instance
        .get(`get_party_expenses/${id}?page=${page}&limit=${limit}`)
}
export function marketExpenses(id, page, limit, from_time, to_time) {
    if (from_time && to_time) {
        return instance
            .get(`get_market_expenses/${id}?from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_market_expenses/${id}?page=${page}&limit=${limit}`)
    }
}
export function createFixedExpense(data) {
    return instance
        .post("create_fixed_expense", data)
}
export function updateFixedexpense(data) {
    return instance
        .put("update_fixed_expense/" + data.id, data)
}
export function payForFixedExpense(data) {
    return instance
        .post("pay_for_fixed_expense", data)
}
export function payForVariableExpense(data) {
    return instance
        .post("pay_for_variable_expense", data)
}
export function payForPartyExpense(data) {
    return instance
        .post(`pay_for_party_expense/`, data)
}
export function payForMarketExpense(data) {
    return instance
        .post(`pay_for_market_expense`, data)
}
export function payForUser(data) {
    return instance
        .post(`pay_to_user`, data)
}
export function userExpenses(user_id, from_time, to_time, page, limit) {
    if (from_time && to_time) {
        return instance
            .get(`get_user_expenses?${user_id}&from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_user_expenses?${user_id}&page=${page}&limit=${limit}`)
    }
}
export function payForAdmin(data) {
    return instance
        .post(`pay_to_admin`, data)
}
export function adminExpenses(branch_id, from_time, to_time, page, limit) {
    if (from_time && to_time) {
        return instance
            .get(`get_admin_expenses/${branch_id}?from_time=${from_time}&to_time=${to_time}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_admin_expenses/${branch_id}?page=${page}&limit=${limit}`)
    }
}

// distribute

export function distribute() {
    return instance
        .get(`get_orders_for_distributed_profit`)
}
export function postDistribute() {
    return instance
        .post(`profit_sharing`)
}
export function distributeHistory(date, page, limit) {
    if (date) {
        return instance
            .get(`get_distributed_profit?day=${date}&page=${page}&limit=${limit}`)
    } else {
        return instance
            .get(`get_distributed_profit?page=${page}&limit=${limit}`)
    }
}

// statistic

export function statisticOrders(from_time, to_time, branch_id) {
    return instance
        .get(`get_trade_statistics?from_time=${from_time}&to_time=${to_time}&branch_id_admin=${branch_id}`)
}
export function statisticProducts(from_time, to_time, branch_id) {
    return instance
        .get(`get_product_statistics?from_time=${from_time}&to_time=${to_time}&branch_id_admin=${branch_id}`)
}
export function statisticUsers(from_time, to_time, branch_id) {
    return instance
        .get(`get_user_statistics?from_time=${from_time}&to_time=${to_time}&branch_id_admin=${branch_id}`)
}
export function statisticDaily(date, branch_id) {
    return instance
        .get(`get_daily_statistics?day=${date}&branch_id_admin=${branch_id}`)
}