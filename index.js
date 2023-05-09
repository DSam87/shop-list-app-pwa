import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-101ef-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")
let clickTimer = null;

addButtonEl.addEventListener("click", function() {
    if(inputFieldEl.value === "") return;
    let inputValue = inputFieldEl.value
    let objectToSave = {inputValue, itemCross: false}
    
    push(shoppingListInDB, objectToSave)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}

function appendItemToShoppingListEl(item) {
    console.log(item)
    let itemID = item[0]
    let itemValue = item[1].inputValue
    let itemCross = item[1].itemCross
    
    let newEl = document.createElement("li");
    if(itemCross){
        newEl.classList.add("cross")
    }
    
    newEl.textContent = itemValue

    function singleClickFunction(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        console.log(itemCross);
        update(exactLocationOfItemInDB, {inputValue:itemValue, itemCross: !itemCross})
    }

    function dblClickFunction(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    }
    
    newEl.addEventListener("click", function() {
        if (clickTimer == null) {
            clickTimer = setTimeout(function () {
                clickTimer = null;
                singleClickFunction();
    
            }, 250)
        } else {
            clearTimeout(clickTimer);
            clickTimer = null;
            dblClickFunction();
    
        }
    })
    
    shoppingListEl.append(newEl)
}