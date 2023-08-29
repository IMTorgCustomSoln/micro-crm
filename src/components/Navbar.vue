<template>
<div >
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav >
        <b-nav-item href="#">Home</b-nav-item>
  
        <!-- Navbar dropdowns -->
        <b-nav-item-dropdown text="View" >
          <b-dropdown-item href="#">Customer Lifecycle</b-dropdown-item>
          <b-dropdown-item href="#">Project Portfolio</b-dropdown-item>
          <b-dropdown-item href="#">User</b-dropdown-item>
        </b-nav-item-dropdown>
  
        <b-nav-item-dropdown text="User" >
          <b-dropdown-item href="#">Account</b-dropdown-item>
          <b-dropdown-item href="#">Settings</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<style scoped>
.navbar{
    margin-bottom: 10px;
}

</style>