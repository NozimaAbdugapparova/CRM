import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Status } from '@prisma/client';
import { PrismaService } from 'src/core/database/prisma.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { FilterDto } from './dto/filter.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}


  async getOneGroup(groupdId: number){
    const existGroup = await this.prisma.group.findFirst({
        where:{
            id: groupdId,
            status: Status.active
        },
        select:{
            id:true,
            name:true,
            max_student:true,
            start_date:true,
            start_time:true,
            week_day:true,
            created_at:true,
            courses:{
                select:{
                    id: true,
                    name: true,
                    duration_month: true
                }
            },
            rooms:{
                select:{
                    id:true,
                    name:true
                }
            },
            teachers:{
                select:{
                    id:true,
                    first_name:true,
                    last_name:true,
                    photo: true
                }
            }
        }
    })
    if(!existGroup) throw new NotFoundException("group is not found with this id")

    
    return {
        success: true,
        data: existGroup
    }
  }

  async getOneGroupStudents(groupdId: number){
    const existGroup = await this.prisma.group.findFirst({
        where:{
            id: groupdId,
            status: Status.active
        }
    })
    if(!existGroup) throw new NotFoundException("group is not found with this id")

    const groupStudents = this.prisma.studentGroup.findMany({
        where:{
            group_id: groupdId,
            status: Status.active
        },
        select:{
            students:{
                select:{
                    id: true,
                    first_name: true,
                    last_name: true,
                    phone:true,
                    email: true,
                    photo: true,
                    birth_date: true,
                    created_at: true
                }
            }
        }
    })

    const dataFormatter = (await groupStudents).map(el => el.students)
    return {
        success: true,
        data: dataFormatter
    }
  }

  async getAllGroups(search: FilterDto) {
    const {groupName, maxStudent} = search
    let where = {
        status: Status.active
    }

    if(groupName){
        where['name']= groupName
    }

    if(maxStudent){
        where['max_student'] = +maxStudent
    }

    const groups = await this.prisma.group.findMany({
      where,
        select:{
            id:true,
            name:true,
            max_student:true,
            start_date:true,
            start_time:true,
            week_day:true,
            courses:{
                select:{
                    id: true,
                    name: true
                }
            },
            rooms:{
                select:{
                    id:true,
                    name:true
                }
            },
            teachers:{
                select:{
                    id:true,
                    first_name:true,
                    last_name:true
                }
            }
        }
    });

    return {
      success: true,
      data: groups,
    };
  }

  async createGroup(payload : CreateGroupDto) {

    const hourToMinutes =(time: string)=>{
        const [h, m] = time.split(':').map(Number);
        return h*60+m;
    }

    const existCourse = await this.prisma.course.findFirst({
        where:{
            id: payload.course_id,
            status:Status.active
        }
    })

    if(!existCourse){
        throw new NotFoundException("Course is not found by this ID")
    }


    const existTeacher = await this.prisma.teacher.findFirst({
        where:{
            id: payload.teacher_id,
            status:Status.active
        }
    })

    if(!existTeacher){
        throw new NotFoundException("Teacher is not found by this ID")
    }

    const existGroup = await this.prisma.group.findUnique({
      where: { name: payload.name },
    });

    if (existGroup)
      throw new ConflictException('This group is already exist');

    const existRoom = await this.prisma.room.findFirst({
        where:{
            id: payload.room_id,
            status:Status.active
        }
    })

    if(!existRoom){
        throw new NotFoundException("Room is not found by this ID")
    }

    const existRoomGroups = await this.prisma.group.findMany({
        where:{
            room_id: payload.room_id,
            status: Status.active
        },
        select:{
            start_time:true,
            courses:{
                select:{
                    duration_hours:true
                }
            }
        }
    })
    
    const startNew = hourToMinutes(payload.start_time);
    const endNew = startNew + existCourse?.duration_hours * 60;
    const isRoomBusy = existRoomGroups.some(el=>{
        const start = hourToMinutes(el.start_time);
        const end = start+ el.courses.duration_hours *60;

        return start<endNew && end>startNew
    })

    if(isRoomBusy) throw new ConflictException("Room is busy at that time")
    await this.prisma.group.create({
      data: {
        ...payload,
        start_date: new Date(payload.start_date)
      }
    });

    return {
      success: true,
      message: 'Group is created',
    };
  }
}
