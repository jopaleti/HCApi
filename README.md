Trip == Ride

<!-- For updating data in nodejs mysql -->

var data = {
password: pass,
confirm_password: confirm_password
}

pool.query(`UPDATE users SET ? WHERE id = ${id}`, data, (err, result) => {
<!-- The remaining code goes here -->
})

For more information on the API endpoints check the routes folder