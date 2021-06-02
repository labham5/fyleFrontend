<template>
  <b-container fluid id="home">
    <b-row >
      <b-col offset-md="1" md="10" class=" top-card" >        
        <b-container fluid id="head-wrap">
          <b-row>
            <b-col md="6">
              <h2>Fyle Assignment</h2>
            </b-col>
            <b-col offset-md="5" md="1">
              
              <b-button @click="changeTheme()" id="theme-btn" >
                <b-icon :icon="icon" font-scale="1.7" ></b-icon>
              </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
    <b-row  >
      <b-col offset-sm="1" offset-md="1" sm="10" md="10" class="list-card">
        <b-container fluid>
          <b-row>
            <b-col sm="6" md="5">
              <b-form-input
                id="input-search"
                v-model="form.search"
                placeholder="Search..."
                @keyup="searchTable()"
              ></b-form-input>
            </b-col>
            <b-col sm="2" md="2" class="center">
              <b-dropdown  :variant="dropdownTheme" :text="changeCityDropdownText" block  >
                <b-dropdown-item  v-for="city in cities" :key="city" @click="changeCity(city)">{{city}}</b-dropdown-item>
              </b-dropdown>
            </b-col>
            <b-col md="2" sm="2" class="center">
              <b-dropdown :variant="dropdownTheme" :text="pageSizeDropdownText" block >
                <b-dropdown-item @click="changePageSize(5)">5</b-dropdown-item>
                <b-dropdown-item @click="changePageSize(10)">10</b-dropdown-item>
                <b-dropdown-item @click="changePageSize(25)">25</b-dropdown-item>
                <b-dropdown-item @click="changePageSize(50)">50</b-dropdown-item>
                <b-dropdown-item @click="changePageSize(100)">100</b-dropdown-item>
              </b-dropdown>
            </b-col>
            <b-col md="3" sm="3" id="page-info">
              <div class="">
                <b-button variant="danger" @click="prevPage()" v-show="offset >0">
                  <b-icon icon="arrow-left-circle-fill" font-scale="1.5"></b-icon>
                </b-button>
              </div>
              <div class="">
                <h5>
                  Page : {{currentPage}}
                </h5>
              </div>
              <div class="">
                <b-button variant="primary" @click="nextPage()">
                  <b-icon icon="arrow-right-circle-fill" font-scale="1.5"></b-icon>
                </b-button>  
              </div>  
            </b-col>
          </b-row>
          <b-row>
            <b-col md="12">
              <b-form-group id="favourites-group" v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group
                  v-model="form.checked"
                  id="favourites"
                  :aria-describedby="ariaDescribedby"
                >  
                  <b-table v-if="filteredItems.length>0" bordered responsive class="search-tabel" striped hover :items="filteredItems" :fields="fields" :dark="tableColor">
                    <template #cell(favourite)="data">
                      <b-form-checkbox :value="data.item" @change="markAsFavourite()"></b-form-checkbox>
                    </template>
                  </b-table>
                </b-form-checkbox-group> 
              </b-form-group> 
              <div v-if="filteredItems.length<1" class="search-tabel center">
                <img src="@/assets/noResults.png" alt="" height="30%">
                <br>
                <h1>
                  No results to display!
                </h1>
              </div>
              <div >
                <p>
                  Handcrafted by
                  <a target="blank" href="https://www.linkedin.com/in/labhvam-kumar-sharma-9b55b1175/"> Labhvam Kumar Sharma </a> 
                </p>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Branch from '../apis/Branch'
export default {
  name: 'Home',
  data()
  {
    return{
      fields:[{ key: 'favourite', label: 'Mark' },'bank_id', 'ifsc','branch','address','city','district','state'],
      form:{
        page:null,
        search:null,
        checked:[],
      },
      theme:light,
      pageSize:5,
      offset:0,
      city:'Bangalore',
      cities:['Bangalore','Pune','Mumbai','Delhi','Kolkata'],       
      filteredItems:[],
      items: []
    }
  },
  computed:{
    icon()
    {
      if(this.theme == 'light')
      {
        return 'moon';
      }
      else
      {
        return 'sun';
      }
    },
    dropdownTheme()
    {
      if(this.theme == 'light')
      {
        return 'light';
      }
      else
      {
        return 'dark';
      }
    },
    tableColor()
    {
      if(this.theme == 'light')
      {
        return false;
      }
      else
      {
        return true;
      }
    },
    pageSizeDropdownText()
    {
      return 'Page Size: '+this.pageSize;
    },
    changeCityDropdownText()
    {
      return this.city
    },
    currentPage()
    {
      var page=(this.offset/this.pageSize)+1;
      return page;
    }
  },
  methods:{
    markAsFavourite()
    {
      // var items=JSON.parse(localStorage.getItem('favourites'))
      // if( items== undefined ||items ==null || items.length <1 )
      // {
      //   localStorage.setItem('favourites',JSON.stringify(this.form.checked));
      // } 
      // else
      // {
        localStorage.setItem('favourites',JSON.stringify(this.form.checked));
        // console.log("ELse");
      // }
    },
    changeTheme()
    {
      this.theme == 'light'?this.theme='dark':this.theme='light'

      this.$emit('change')
    },
    searchTable()
    {
      var value=this.form.search.toUpperCase();
      this.filteredItems=this.items.filter(item=>{
        if(item.ifsc.includes(value) ||item.bank_id.toString().includes(value)|| item.branch.includes(value) 
            || item.address.includes(value) || item.city.includes(value)||item.district.includes(value)||item.state.includes(value) )
        {
          return item;
        }
      })      
    },
    changePageSize(size)
    {
      this.pageSize=size
      this.offset=0
      Branch.all(this.city,this.pageSize,this.offset)
      .then(res=>{
        this.filteredItems=res.data.branches;
        this.items=res.data.branches;
      })
      .catch(err=>{
        console.log(err);
      })
    },
    changeCity(city)
    {
      this.city=city
      this.offset=0
      Branch.all(this.city,this.pageSize,this.offset)
      .then(res=>{
        this.filteredItems=res.data.branches;
        this.items=res.data.branches;
      })
      .catch(err=>{
        console.log(err);
      })
    },
    nextPage()
    {
      this.offset=this.offset+this.pageSize
      Branch.all(this.city,this.pageSize,this.offset)
      .then(res=>{
        this.filteredItems=res.data.branches;
        this.items=res.data.branches;
      })
      .catch(err=>{
        console.log(err);
      })
    },
    prevPage()
    {
      this.offset=this.offset-this.pageSize
      Branch.all(this.city,this.pageSize,this.offset)
      .then(res=>{
        this.filteredItems=res.data.branches;
        this.items=res.data.branches;
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },
  mounted()
  {
    Branch.all(this.city,this.pageSize,this.offset)
    .then(res=>{
      this.filteredItems=res.data.branches;
      this.items=res.data.branches;
      this.pageSize=this.filteredItems.length;
    })
    .catch(err=>{
      console.log(err);
    })
    this.theme= localStorage.getItem('theme'); 
  },
  created()
  {
    var favourites=JSON.parse(localStorage.getItem('favourites'));
    if(favourites == null || favourites == undefined || favourites.length <1)
    {
      this.form.checked=[];
    }
    else
    {
      this.form.checked=favourites;
    }
    console.log(JSON.parse(localStorage.getItem('favourites')))
  }
}
</script>

<style >
#home{
  height: 100vh;
  background: var(--bg);
  color:var(--color-text);
  padding-top:3vh;
}

a{
  text-decoration: none !important;
  color: var(--color-headings) !important;
}
.top-card{
  background-color:  var(--bg-panel) ;
  box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.37),
  0 15px 35px 0 rgba(50, 50, 93, 0.1);
  border-radius: 6px;
  padding: 30px 40px 20px 40px; 
  margin-bottom: 3vh;
}
#head-wrap{
  border-bottom: 3px solid var(--inverse);

}
.center{
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.top-card h2{
  color:var(--color-headings);
  padding-left: 30px;
  padding-bottom: 10px;
  
}

#page-info{
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.list-card{
    background-color:  var(--bg-panel) ;
    box-shadow: 0 5px 15px 0 rgba(0, 0, 0, 0.37),
    0 15px 35px 0 rgba(50, 50, 93, 0.1);
    border-radius: 6px;
    padding: 20px 20px 10px 20px; 
}
.search-tabel{
  margin-top:3vh;
  height: 55vh;
}

#theme-btn{
  background: var(--inverse);
  color: var(--bg);
}
</style>
