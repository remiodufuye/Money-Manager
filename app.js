

// BUDGET CONTROLLER 

// First Module is the Budget Controller
var BudgetController = ( function() {

    var Expense = function(id , description , value) {
        this.id = id ;
        this.description = description;
        this.value =  value ; 
        this.percentage = -1 ; 
    
    };
    
    Expense.prototype.calcpercentage = function(totalincome) { 
        
        if (totalincome > 0 ) {
             this.percentage = Math.round((this.value / totalincome) * 100 ) ;  
        } else {
            this.percentage = -1 ; 
        }   
    };
    
    Expense.prototype.getpercentage = function() {
        return this.percentage ; 
    };
    
      var Income = function(id , description , value) {
        this.id = id ;
        this.description = description;
        this.value =  value ; 
    
    };
    
    
    var CalculateTotal = function(type)  {
        var sum = 0 ; 
        data.allItems[type].forEach(function(cur) {
            sum += cur.value ;         
        }) ; 
        
        data.totals[type] = sum ;
    } ;
    
    var data =  {
        allItems : {
            exp :[] ,
            inc:[]
        } ,
        
        totals : {
            exp :0 ,
            inc:0
        } ,
        
        budget: 0 , 
        percentage: -1
        
    };
    
    return {
        addItem : function(type , des , val ) {
        var newItem , ID ;   
        
        // ID should be equal to the Last ID + 1 
                 
         if ( data.allItems[type].length > 0 ) { 
            ID = data.allItems[type][data.allItems[type].length - 1 ].id + 1 ;   
        } else {
            ID = 0 ; 
        }
            
        //Create new ID based on 'inc' or 'exp' type
        if (type === 'exp') {
        newItem = new Expense(ID , des , val) ;  
        } else if (type == 'inc') {
        newItem = new Income (ID , des , val) ;
        }
       
        // push it into our data structure   
       data.allItems[type].push(newItem); 
     
            
        // return the new element 
        return newItem ; 
            
        } , 
        
        
        
        deleteItem : function(type , id ) {
            var ids , index ;
            // id = 6
            // data.allItems[type][id]; 
            // ids = [1 2 4 6 8 ]
            // index = 3 
            
            ids = data.allItems[type].map(function(current) {
                return current.id ; 
            });
            
            index = ids.indexOf(id) ;
            
            if ( index !== -1 ) {
                data.allItems[type].splice(index,1);
            }
        } , 
        
        
        
        
        calculatebudget : function() {
            
            // Calculate Total Income and Expenses
            CalculateTotal('exp') ; 
            CalculateTotal('inc') ;
            
            // Calculate the Budget : Income - Expenses
            
            data.budget = data.totals.inc - data.totals.exp;
            
            // Calculate the percentage of income that we spent 
            
            if (data.totals.inc > 0 )  { 
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100 ) ; 
            } else {
            data.percentage = -1 ; 
            }
        } , 
        
        
        CalculatePercentages : function() {
          
            /*
            a= 20 
            b =10
            c = 40 
            */
            
            data.allItems.exp.forEach(function(cur) {
                cur.calcpercentage(data.totals.inc);
            }) ; 
        } , 
        
        
        getPercentages: function() {
            var AllPerc = data.allItems.exp.map(function(cur){
                return cur.getpercentage() ; 
            });
            return AllPerc ; 
        } , 
        
        getBudget :function () {
            return {
                budget : data.budget ,
                TotalInc : data.totals.inc ,
                TotalExp : data.totals.exp , 
                percentage : data.percentage
            };
        } , 
        
        testing : function () {
            console.log(data) ; 
        }
             
    }
    
}) () ; 




// UI Controller 
var UIController = (function() {
    
    var DOMstrings = {
        inputType:'.add__type',
        inputDescription:'.add__description',
        inputValue:'.add__value',
        inputBtn:'.add__btn' ,
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list' ,
        budgetlabel:'.budget__value' ,
        incomelabel:'.budget__income--value' ,
        expenseslabel:'.budget__expenses--value',
        percentagelabel:'.budget__expenses--percentage',
        container : '.container',
        expensesPerclabel: '.item__percentage' ,
        datelabel : '.budget__title--month'
    };
    
          var formatNumber = function (num , type) {

            var  numSplit , int , dec , type ;
            
            num = Math.abs(num);
            num = num.toFixed(2);
            
            numSplit = num.split('.') ;
            
            // Formatting changed to suite 3 commas for larger figures 
            int = numSplit[0];
            if (int.length > 3 && int.length < 7 ) {
                int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,3) ;       
            } else if ( int.length >= 7 ){ 
                int = int.substr(0,int.length - 6) + ',' + int.substr(int.length - 6,3) + ',' + int.substr(int.length - 3,3); 
            }
              
              
            /* Original code below for formating 3 with comma 
            
            int = numSplit[0];
            if (int.length > 3 ) {
                int = int.substr(0,int.length - 3) + ',' + int.substr(int.length - 3,3) ;
            }
            
            
            */
              
            dec = numSplit[1];
            
            return (type === 'exp' ?  '-' :  '+' ) + ' ' + int + '.' + dec ;
        };
    
    
         
            var nodeListForEach = function( list , callback) {
                for (var i = 0 ; i < list.length ; i++ ) {
                    callback(list[i],i);  
                }
            } ;
            
    
    return  {
        getInput : function() {
            
             return {              
             type: document.querySelector(DOMstrings.inputType).value ,  // This will either be inc or exp 
             description: document.querySelector(DOMstrings.inputDescription).value ,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            } ;     
        } ,
        
        
        addListItem : function(obj , type) {
            
            var html , newHtml , element; 
            // Create HTML String with PlaceHolder text
            
            if (type === 'inc')  {
              element = DOMstrings.incomeContainer ; 
                
              html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>' ; 
                
            } else if (type === 'exp') {
              element = DOMstrings.expensesContainer ; 
                
              html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button</div></div></div>';
                   
            }
    
           
            // Replace placeholder Text with some actual data 
            
            newHtml = html.replace('%id%' , obj.id) ; 
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM 
            
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml) ; 
            
        } , 
        
        
        deleteListItem : function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        } ,
        
        
        clearFields : function () {
            var fields  , fieldsArr ; 
            fields = document.querySelectorAll(DOMstrings.inputDescription +  ',  ' + DOMstrings.inputValue); 
            
            fieldsArr = Array.prototype.slice.call(fields) ; 
            
            fieldsArr.forEach(function(current , index , array) {
                  current.value = "" ; 
                
            
            fieldsArr[0].focus();
            
            });
        } , 
        
        
        dislayBudget : function(obj) {
             
            var type ; 
            obj.budget > 0 ? type = 'inc' : type = 'exp' ;
            document.querySelector(DOMstrings.budgetlabel).textContent = formatNumber(obj.budget , type ) ; 
            document.querySelector(DOMstrings.incomelabel).textContent = formatNumber(obj.TotalInc ,'inc'); 
            document.querySelector(DOMstrings.expenseslabel).textContent = formatNumber(obj.TotalExp ,'exp'); 
    
            if (obj.percentage > 0 ) {
                document.querySelector(DOMstrings.percentagelabel).textContent = obj.percentage + '%' ;   
                } else {
                document.querySelector(DOMstrings.percentagelabel).textContent = '---' ;      
                }
            
            
                               
        } , 
        
        
        displaypercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPerclabel); 

           nodeListForEach( fields , function(current , index ) {
               
                if (percentages[index] > 0 ) {
                 current.textContent = percentages[index] + '%';
                } else {
                 current.textContent = '---';
                }    
           }) ; 
            
            
        } , 
        
        
        displayMonth : function() {
            var now , year , month , months;
            now = new Date() ;
            
            months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
            month = now.getMonth();
            
            year = now.getFullYear();
            document.querySelector(DOMstrings.datelabel).textContent = months[month] + ' ' + year ;
        },
        
        
        ChangeType: function(){
            
            var Fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' + 
                DOMstrings.inputValue);
           // ); // is this needed 
            
            nodeListForEach(Fields , function(cur) { 
                cur.classList.toggle('red-focus');
            }) ;
            
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            
        },
        
        getDomStrings : function() {
            return DOMstrings ;
        }
 
        
    } ;
        
}) () ; 



// Global App Controller 
var Controller = (function(budgetCtrl , UICtrl) {
    
    
    var SetupEventListeners = function() {  // Global APP Controller Function 
        
        var DOM = UICtrl.getDomStrings(); 
        
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem) ; 

        document.addEventListener('keypress' , function(event)  {
  
        if (event.keycode === 13 || event.which === 13  ) {
      
        ctrlAddItem() ; 
        }
    }) ;
        
        document.querySelector(DOM.container).addEventListener('click',CtrlDeleleItem) ; 
        
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.ChangeType);
        
    };
    
    

     var updateBudget = function() {
         
        // 1. Calculate the Budget 
         budgetCtrl.calculatebudget();
    
        // 2. Return the Budget
         
         var budget = budgetCtrl.getBudget() ;
         
        // 3. Display the Budget on the UI 
         
         UICtrl.dislayBudget(budget) ; 
            
     }; 
    
    
     var updatePercentages =function() {
         
        // 1. Calculate the Percentages
         budgetCtrl.CalculatePercentages() ;
        // 2. Read the percenages from the Budget Controller
        var percentages =  budgetCtrl.getPercentages();
        // 3. Update the UI with the new percentages 
         UICtrl.displaypercentages(percentages);
     } ; 
    
    
    
    var ctrlAddItem = function()  {  // Global App Controller Function 
    
         var input , newitem ; 
        
    // 1. Get the Field Input Data
    
       input = UICtrl.getInput() ; 
    
        
      if (input.description !== "" && !isNaN(input.value) && input.value > 0 ) {
          
            // 2. Add the item to the budget controller 
        
            newitem = budgetCtrl.addItem(input.type , input.description , input.value) ; 
    
            // 3. Add the new item to the User Interface 
        
            UICtrl.addListItem (newitem , input.type);
        
            // 4. Clear the Fields 
            UICtrl.clearFields() ; 
            
            // 5. Calculate and Update Budget 
            updateBudget() ; 
          
           // 6. Calculate and update the percentages
            updatePercentages();
      }
     
};
  

    var CtrlDeleleItem = function(event) {
        var itemID , SplitID , type , ID ;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id ;
        
        if(itemID) {
           
            SplitID  = itemID.split('-');
            type = SplitID[0];
            ID = parseInt(SplitID[1]) ; 
            
            // 1.   Delete the Item from the Data Structure 
            
            budgetCtrl.deleteItem(type,ID);
            
            // 2.   Delete the item from the UI 
            
            UICtrl.deleteListItem(itemID);
            
            // 3.   Update and show the new Budget 
            updateBudget() ; 
            
            // 4. Calculate and update the percentages
            updatePercentages();
            
            
            
        }
    }; 
    
 return {
     init : function() {    
        console.log('The Application Has Started . ') ; 
        UICtrl.displayMonth();
        UICtrl.dislayBudget({
                budget:0,
                TotalInc:0,
                TotalExp:0, 
                percentage:-1
            }) ; 
        SetupEventListeners() ;
            
     }
 };
    
}) (BudgetController , UIController) ; 


Controller.init() ; // Initialize Global App Controller 






































