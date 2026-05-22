import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';


@ApiBearerAuth()
@Controller('rooms')
export class RoomsController {
    constructor(private readonly roomService: RoomsService){}



    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('all')
    getAllRooms(){
        return this.roomService.getAllRooms()
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get('all/archived')
    getAllArchivedRooms(){
        return this.roomService.getAllArchivedRooms()
    }


    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Post('add/new')
    createRoom(@Body() payload: CreateRoomDto){
        return this.roomService.createRoom(payload)
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Patch('update/room/:id')
    updateRoom(
        @Body() payload : UpdateRoomDto,
        @Param('id', ParseIntPipe) id :number
    ){
        return this.roomService.updateRoom(payload, id)
    }


    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RoleGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete('delete/:id')
    deleteRoom(
        @Param('id', ParseIntPipe) id : number 
    ){
        return this.roomService.deleteRoom(id)
    }
}
