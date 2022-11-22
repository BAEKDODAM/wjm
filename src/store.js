import { createSlice, configureStore } from '@reduxjs/toolkit'

let area = createSlice({
    name : 'area',
    initialState : {강남},
    reducers: {
      addArea(state, action){
        state.push(action.payload)
      }
    }
})

// 오른쪽 자료를 변수로 빼는 문법
export let {addArea} = area.actions

export default configureStore({
  reducer: { 
    // 작명: 위에 만든 state.reducer
    area: area.reducer
   }
}) 