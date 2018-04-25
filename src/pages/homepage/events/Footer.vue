<template>
    <span>
      <v-container>
      <v-card>
	  <v-flex md12 class="footer-app">
    <v-list two-line subheader>
          
      <v-list-tile-content>
        <v-list-tile-title ><a href="#"> About</a></v-list-tile-title>
      </v-list-tile-content>
			<v-list-tile-content>
        <v-list-tile-title ><a href="#"> Help Center</a></v-list-tile-title>
      </v-list-tile-content>
			<v-list-tile-content>
        <v-list-tile-title ><a href="#"> Privacy & Terms</a></v-list-tile-title>
      </v-list-tile-content>
			<v-list-tile-content>
        <v-list-tile-title ><a href="#"> Advertising</a></v-list-tile-title>
      </v-list-tile-content>
			<v-list-tile-content>
        <v-list-tile-title ><a href="#"> Business Services</a></v-list-tile-title>
      </v-list-tile-content>
      
    </v-list>
    <v-list two-line subheader>
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title style="text-align:center;"><img class="footer-logo" src="https://firebasestorage.googleapis.com/v0/b/defense-exchange.appspot.com/o/site_settings%2Fstyles%2Fgeneral%2Flogo?alt=media&token=5048e847-1a44-4c1d-b678-be775d59688c" /><a href="#"> Xchange @2017 </a></v-list-tile-title>
        </v-list-tile-content>
  
      </v-list-tile>
    </v-list>
</v-flex>
      </v-card>
    </v-container>
    
    </span>
	
</template>

<style>
  .footer-app {
    padding-top: 15px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 15px;
  } 
  .footer-app .list__tile__content {
    width: auto;
    display:inline;
    padding: 5px;
  }
  .footer-app .list__tile__title {
    display: inline;
    padding: 5px;
	  font-size:11px !important;
  }
  .footer-app .list__tile__title a{
    text-decoration:none;

  }
  .footer-logo{
    height: 20px;
    width: 50px;
  }
</style>

