import "../../css/Pieces.css";
import Piece from "./Piece";
import { useRef } from "react";
import { useAppContext } from "../../contexts/Context";
import { openPromotion } from "../../reducer/actions/popup";
import arbiter from "../../arbiter/arbiter";
import { clearCandidates, makeNewMove } from "../../reducer/actions/move";
import { getCastlingDirections } from "../../arbiter/getMoves";
import { updateCastling } from "../../reducer/actions/game";

const Pieces = () => {

  const { appState , dispatch } = useAppContext();
  const currentPosition = appState.position[appState.position.length-1]

  const ref = useRef()

  const updateCastlingState = ({piece,file,rank}) => {
      const direction = getCastlingDirections({
          castleDirection:appState.castleDirection,
          piece,
          file,
          rank
      })
      if (direction){
          dispatch(updateCastling(direction))
      }
  }

  const openPromotionBox = ({rank,file,x,y}) => {
      dispatch(openPromotion({
          rank:Number(rank),
          file:Number(file),
          x,
          y
      }))
  }

  const calculateCoords = e => {
      const {top,left,width} = ref.current.getBoundingClientRect()
      const size = width / 8
      const y = Math.floor((e.clientX - left) / size) 
      const x = 7 - Math.floor((e.clientY - top) / size)

      return {x,y}
  }

  const move = e => {
      const {x,y} = calculateCoords(e)
      const [piece,rank,file] = e.dataTransfer.getData("text").split(',')

      if(appState.candidateMoves.find(m => m[0] === x && m[1] === y)){
          if ((piece==='wp' && x === 7) || (piece==='bp' && x === 0)){
              openPromotionBox({rank,file,x,y})
              return
          }
          if (piece.endsWith('r') || piece.endsWith('k')){
              updateCastlingState({piece,file,rank})
          }
          const newPosition = arbiter.performMove({
              position:currentPosition,
              piece,rank,file,
              x,y
          })
          dispatch(makeNewMove({newPosition}))
      }
      dispatch(clearCandidates())
  }

  const onDrop = e => {
      e.preventDefault()
      
      move (e)
  }
  
  const onDragOver = e => {e.preventDefault()}

  return <div 
      className='pieces' 
      ref={ref} 
      onDrop={onDrop} 
      onDragOver={onDragOver} > 
      {currentPosition.map((r,rank) => 
          r.map((f,file) => 
              currentPosition[rank][file]
              ?   <Piece 
                      key={rank+'-'+file} 
                      rank = {rank}
                      file = {file}
                      piece = {currentPosition[rank][file]}
                  />
              :   null
          )   
      )}
  </div>
}

export default Pieces