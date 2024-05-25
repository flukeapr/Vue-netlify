<script setup>
import { ref,onMounted } from 'vue';
import { db } from '../config/Firebase'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc,orderBy,query } from "firebase/firestore";
import { useRouter, useRoute } from 'vue-router'
import { Timestamp } from "firebase/firestore";
import Swal from 'sweetalert2'
const route = useRoute();
const router = useRouter();
const todo = ref([])
const search = ref('')
const title = ref('')
const description = ref('')
const deadline = ref('')
const docId = ref('')
  onMounted(async()=>{
    await loadData();
  })

  const loadData = async () => {
        const todoRef = collection(db, "Todo");
        const q = query(todoRef,orderBy('DeadLine','desc'))
        const data = await getDocs(q);
        const todoList = data.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        todo.value = todoList.filter(item=>item.Status!=="สำเร็จ").concat(todoList.filter(item=>item.Status === "สำเร็จ"));
    }

    const addTodo = async ()=>{
   
        const list = {
            Title: title.value,
            Description: description.value,
            DeadLine: Timestamp.fromDate(new Date(deadline.value)),
            Date: Timestamp.fromDate(new Date()),
            Status: "รอดำเนินการ"
        }
       const docRef = collection(db,'Todo')
       await addDoc(docRef,list);
        closeModal(2);
        Swal.fire({
            position: "top-end",
            icon: 'success',
            title: 'บันทึกสำเร็จ',
            showConfirmButton: false,
            timer: 1500
        }).then(async()=>{
            await loadData();
        })
        
    }
    const deleteTodo = async (id)=>{
        
        const docRef = doc(db,'Todo',id)
        await deleteDoc(docRef);
        Swal.fire({
            position: "top-end",
            icon: 'success',
            title: 'ลบสำเร็จ',
            showConfirmButton: false,
            timer: 1500
        }).then(async()=>{
            await loadData();
        })
      

    }

const formatDeadline =(deadline) => {
    const date = new Date(deadline.seconds * 1000);
      return date.toLocaleString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric', 
        hour24: true 
      });
    }

const showModal2 = () =>{
    document.getElementById('my_modal_2').showModal()

}
const showModal3 = (id) =>{
    document.getElementById('my_modal_3').showModal()
    docId.value = id
    console.log(docId.value)

}
const closeModal = (id)=>{
    document.getElementById(`my_modal_${id}`).close()
}

const updateStatus = async(status)=>{
  const id = docId.value;
    const docRef = doc(db,'Todo',id)
    await updateDoc(docRef,{Status:status})
    closeModal(3);
    Swal.fire({
        position: "top-end",
        icon: 'success',
        title: 'อัพเดทสำเร็จ',
        showConfirmButton: false,
        timer: 1500
    })
    await loadData();
 
}
    

</script>


<template >
   

    
    <div class="background-dots">
      <div class="dot red"></div>
      <div class="dot pink"></div>
      <div class="dot gray"></div>
      <div class="dot green"></div>
      <div class="dot blue"></div>
      <div class="dot yellow"></div>
      <div class="dot brown"></div>
      <div class="dot purple"></div>
      <div class="dot blue2"></div>
      <div class='p-20'>
      <div class="p-6 max-w-sm mx-auto  rounded-xl shadow-md flex items-center space-x-4 bg-white">
      <div class="flex-shrink-0">
        <img class="h-12 w-12" src="../assets/logo.svg" alt="ChitChat Logo">
      </div>
      <div>
        <div class="text-xl font-medium text-black">Todo-List With Vue</div>
        <p class="text-gray-500">let's do it!!</p>
      </div>
    </div>
  
    <div class="flex w-full item-center justify-center p-4 ">
      <label class="input input-bordered w-1/2 flex items-center gap-2 border-solid border-2 ">
        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#ababab" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </g>
        </svg>
        <input type="text" class="grow" placeholder="Search" v-model="search" />
      </label>
  
      <button class="btn btn-square ml-2" @click="showModal2">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
          <g id="SVGRepo_iconCarrier">
            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="#000000" stroke-width="1.5"></circle>
            <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#000000" stroke-width="1.5" stroke-linecap="round"></path>
          </g>
        </svg>
      </button>
    </div>
  
    <div class="flex items-center justify-center w-full h-ful bg-transparent">
      <ul class="w-full p-2">
        <li v-for="item in todo.filter(i =>i.Title && i.Title.toString().includes(search))" :key="item.id">
          
          <div class="flex justify-between p-4 shadow-md rounded-md ">
            <div>
              <h1 class="text-lg font-bold">{{ item.Title }}</h1>
              <p> {{ item.Description }}</p>
              <h5 class="max-sm:hidden">
              วันขิต : 
              {{ 
                item.DeadLine 
                  ? formatDeadline(item.DeadLine) 
                  : 'ไม่มีข้อมูล'
              }} น.
            </h5>            </div>
            <div class="flex items-center">
              <button @click="showModal3(item.id)" :class="`btn  text-white ${item.Status === 'รอดำเนินการ' ? 'btn-primary' : 'btn-success'} m-2`">{{ item.Status }}</button>
              <button @click="deleteTodo(item.id)">
                <svg fill="#808080" width="36px" height="36px" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" stroke="#808080" stroke-width="0.00056"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="1.232"></g><g id="SVGRepo_iconCarrier"><path d="M 27.9999 51.9063 C 41.0546 51.9063 51.9063 41.0781 51.9063 28 C 51.9063 14.9453 41.0312 4.0937 27.9765 4.0937 C 14.8983 4.0937 4.0937 14.9453 4.0937 28 C 4.0937 41.0781 14.9218 51.9063 27.9999 51.9063 Z M 27.9999 47.9219 C 16.9374 47.9219 8.1014 39.0625 8.1014 28 C 8.1014 16.9609 16.9140 8.0781 27.9765 8.0781 C 39.0155 8.0781 47.8983 16.9609 47.9219 28 C 47.9454 39.0625 39.0390 47.9219 27.9999 47.9219 Z M 22.2343 41.9687 L 33.7187 41.9687 C 35.3827 41.9687 36.3436 41.0547 36.4374 39.3906 L 37.3046 20.2656 L 38.6640 20.2656 C 39.2968 20.2656 39.8124 19.7266 39.8124 19.0937 C 39.8124 18.4375 39.2968 17.9219 38.6640 17.9219 L 33.3671 17.9219 L 33.3671 16.0234 C 33.3671 14.1953 32.1483 13.0469 30.4140 13.0469 L 25.5155 13.0469 C 23.7812 13.0469 22.5858 14.1953 22.5858 16.0234 L 22.5858 17.9219 L 17.2655 17.9219 C 16.6327 17.9219 16.0936 18.4375 16.0936 19.0937 C 16.0936 19.7266 16.6327 20.2656 17.2655 20.2656 L 18.6718 20.2656 L 19.5390 39.3906 C 19.6093 41.0547 20.5936 41.9687 22.2343 41.9687 Z M 24.9296 17.9219 L 24.9296 16.4688 C 24.9296 15.8359 25.3749 15.4141 26.0077 15.4141 L 29.8514 15.4141 C 30.5077 15.4141 30.9530 15.8359 30.9530 16.4688 L 30.9530 17.9219 Z M 23.6405 39.3906 C 23.1249 39.3906 22.7733 39.0156 22.7499 38.4531 L 22.1171 22.7266 C 22.0936 22.1875 22.4687 21.7890 23.0546 21.7890 C 23.5936 21.7890 23.9452 22.1641 23.9921 22.7266 L 24.5546 38.4297 C 24.5780 38.9922 24.2265 39.3906 23.6405 39.3906 Z M 27.9530 39.3672 C 27.3905 39.3672 26.9921 38.9922 26.9921 38.4297 L 26.9921 22.7266 C 26.9921 22.1875 27.3671 21.7890 27.9530 21.7890 C 28.5390 21.7890 28.9140 22.1875 28.9140 22.7266 L 28.9140 38.4297 C 28.9140 38.9922 28.5390 39.3672 27.9530 39.3672 Z M 32.2890 39.3906 C 31.7030 39.3906 31.3514 38.9922 31.3749 38.4297 L 31.9374 22.7266 C 31.9609 22.1641 32.3358 21.7890 32.8514 21.7890 C 33.4374 21.7890 33.8358 22.1875 33.8124 22.7266 L 33.1796 38.4531 C 33.1562 39.0156 32.8046 39.3906 32.2890 39.3906 Z"></path></g></svg>           

              </button>
</div>
          </div>
        </li>
      </ul>
    </div>
</div>
    <dialog id="my_modal_2" class="modal">
      <div class="modal-box h-[500px]">
        <h3 class="font-bold text-lg p-4"></h3>
        <div class="flex flex-col gap-4">
          <label class="input input-bordered flex items-center gap-2">
            
            <input type="text" placeholder="ชื่อ Task" class="grow" v-model="title" />
          </label>
  
          <label class="input input-bordered flex items-center gap-2">
            
            <input type="text" placeholder="รายละเอียด" class="grow" v-model="description" />
          </label>
  
          <label class="input input-bordered flex items-center gap-2">
            
            <input type="datetime-local" placeholder="วันขิต" class="grow" v-model="deadline"/>
          </label>
  
         
        </div>
  
        <div class="modal-action">
          <button class="btn btn-primary" @click="addTodo">สร้าง Task</button>
        
            <button class="btn btn-secondary" @click="closeModal(2)">ยกเลิก</button>
          
        </div>
      </div>
    </dialog>
    <dialog id="my_modal_3" class="modal">
      
      <div class="modal-box h-[150px] ">
        <div class="flex justify-end" @click="closeModal(3)">
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="#808080" stroke-width="1.5" stroke-linecap="round"></path> <path d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7" stroke="#808080" stroke-width="1.5" stroke-linecap="round"></path> </g></svg>
        </div>
       <div class="flex items-center justify-center gap-x-6">
        
        <button class="btn btn-primary w-[150px]" @click="updateStatus('รอดำเนินการ')" >รอดำเนินการ</button>
          <button class="btn btn-secondary w-[150px]"@click="updateStatus('สำเร็จ')" >สำเร็จ</button>
       </div>
  
        
       
      </div>
      <form method="dialog" className="modal-backdrop">
    <button>close</button>
  </form>

    </dialog>
    </div>
   
  
    

  </template>
  




<style>
body {
  padding: 10;
  background: white;
}

.background-dots {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index:-1;
  
}

.dot {
  position: absolute;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  z-index: -1000;
}

.dot.red { background: #FF0000; top: 10%; left: 10%; opacity: 0.45;  }
.dot.pink { background: #FFB6C1; top: 20%; left: 30%;  opacity: 0.45;}
.dot.gray { background: #D3D3D3; top: 10%; left: 70%;  opacity: 0.45;}
.dot.green { background: #008000; top: 40%; left: 10%; opacity: 0.45; }
.dot.blue { background: #ADD8E6; top: 60%; left: 50%;  opacity: 0.45;}
.dot.yellow { background: #FFFACD; top: 40%; left: 70%; opacity: 0.45; }
.dot.brown { background: #A52A2A; top: 80%; left: 20%; opacity: 0.45; }
.dot.purple { background: #800080; top: 70%; left: 80%; opacity: 0.45; }
.dot.blue2 { background: #6A5ACD; top: 10%; left: 80%; opacity: 0.45; }


</style>


