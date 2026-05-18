import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create.group.dto';
import { FilterDto } from './dto/filter.dto';


@ApiBearerAuth()
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupService: GroupsService){}
                
    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Get('all')
    getAllGroups(
        @Query() search: FilterDto
    ){
        return this.groupService.getAllGroups(search)
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}, ${Role.TEACHER}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN, Role.TEACHER)
    @Get('/:id')
    getOneGroup(
        @Param('id', ParseIntPipe) groupdId: number
    ){
        return this.groupService.getOneGroup(groupdId)
    }

    @Get('one/students/:groupId')
    getOneGroupStudents(
        @Param('groupId', ParseIntPipe) groupdId: number
    ){
        return this.groupService.getOneGroupStudents(groupdId)
    }
    
    
    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post('/create')
    createGroup(@Body() payload: CreateGroupDto){
        return this.groupService.createGroup(payload)
    }
}
