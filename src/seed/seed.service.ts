import { Injectable } from '@nestjs/common';
import { ClassesService } from 'src/classes/services/classes.service';
import { LocationsService } from 'src/classes/services/locations.service';
import { SchedulesService } from 'src/classes/services/schedules.service';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class SeedService {
    constructor(
        private readonly userService: UsersService,
        private readonly locationService: LocationsService,
        private readonly classService: ClassesService,
        private readonly scheduleService: SchedulesService,
    ) { }

    async seed() {

        await this.userService.create({
            name: 'Admin User',
            email: 'admin@email.com',
            dni: '12345678',
            password: '123456',
            phone: '+51987654321',
            role: 'admin',
            birthdate: '1990-01-01',
        });

        await this.userService.create({
            name: 'Student User',
            email: 'student@email.com',
            dni: '87654321',
            password: '123456',
            phone: '+51912345678',
            role: 'student',
            birthdate: '2005-06-15',
        });

        // Crear ubicaciones
        const location1 = await this.locationService.create({ locationName: 'San Borja', address: 'Club Loreto' });
        const location2 = await this.locationService.create({ locationName: 'Miraflores', address: '456 Elm St' });

        // Crear clases
        const class1 = await this.classService.create(location1.id, { className: 'Marinera Limeña Avanzado', description: 'Marinera para nivel avanzado adultos' });
        const class2 = await this.classService.create(location2.id, { className: 'Marinera Limeña Intermedio', description: 'Marinera para nivel intermedio adultos y jovenes' });
        const class3 = await this.classService.create(location1.id, { className: 'Marinera Norteña Intermedio', description: 'Marinera para nivel intermedio adultos y jovenes' });

        // Crear horarios
        const schedule1 = await this.scheduleService.create(class1.id, { dayOfWeek: 1, startTime: '09:00', endTime: '10:00' });
        const schedule2 = await this.scheduleService.create(class1.id, { dayOfWeek: 3, startTime: '11:00', endTime: '12:00' });
        const schedule3 = await this.scheduleService.create(class1.id, { dayOfWeek: 3, startTime: '12:00', endTime: '13:00' });

        return { message: 'Database seeded successfully' };
    }
}
