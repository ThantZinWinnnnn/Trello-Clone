"use client"
import React, { memo } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { piorityArr } from '../DummyData/data';
import { UseMutateFunction } from '@tanstack/react-query';
import { useAppDispatch } from '@/redux/store/hook';
import { addIssueUpdateType } from '@/redux/features/board.slice';

const IssueDetailPiority = ({val,setPriority,updatePriority,boardId}:Props) => {
    const dispatch = useAppDispatch();
    return (
        <section>
          <Select onValueChange={(val)=>{
            setPriority(val)
            dispatch(addIssueUpdateType("priority"))
            updatePriority({type:"priority",value:val,boardId})
        }
        } 
            defaultValue={val}>
            <SelectTrigger>
              <SelectValue defaultValue={val} placeholder="Please Select piority" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {piorityArr.map((pr, index) => (
                  <SelectItem key={index} value={pr.value}>
                    <div className="flex items-center gap-2">
                      <pr.icon className={`w-4 h-4 ${pr.color}`} />
                      <span className="text-xs font-medium">{pr.value}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <p className="text-[0.7rem] mt-1">Piority in relation to other issues</p>
        </section>
      );
}

export default memo(IssueDetailPiority);

type Props = {
    val: string,
    setPriority:React.Dispatch<React.SetStateAction<string>>,
    updatePriority:UseMutateFunction<any, unknown, IssueUpdateProps, {
        previousIssues: unknown;
    }>,
    boardId:string
}