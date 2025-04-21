import { PrismaClient, Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Teachers
  const teachers = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.teacher.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          hash: faker.internet.password(),
          role: 'TEACHER',
          profileImg: faker.image.avatar(),
        },
      }),
    ),
  );

  // 2. Create Students
  const students = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      prisma.student.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          hash: faker.internet.password(),
          role: 'STUDENT',
          profileImg: faker.image.avatar(),
        },
      }),
    ),
  );

  // 3. Create Courses
  const courses = await Promise.all(
    Array.from({ length: 8 }).map(() => {
      const teacher = faker.helpers.arrayElement(teachers);
      return prisma.course.create({
        data: {
          language: faker.helpers.arrayElement([
            'English',
            'Hebrew',
            'Armenian',
          ]),
          title: faker.commerce.productName(),
          price: new Prisma.Decimal(
            faker.commerce.price({ min: 20, max: 200 }),
          ),
          mainImg: faker.image.urlPicsumPhotos(),
          teacher_id: teacher.id,
          creator_id: teacher.id,
        },
      });
    }),
  );

  // 4. Create Enrollments
  for (const student of students) {
    const enrolledCourses = faker.helpers.arrayElements(courses, 3); // enroll in 3 random courses
    for (const course of enrolledCourses) {
      try {
        await prisma.enrollment.create({
          data: {
            student_id: student.id,
            course_id: course.course_id,
          },
        });
      } catch (err) {
        // Ignore duplicate enrollments
      }
    }
  }

  console.log('✨ Fake data generation complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
