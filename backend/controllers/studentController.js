const Student = require('../models/Student');
const User = require('../models/user');
const Course = require('../models/course');

/**
 * Récupère le profil d'un étudiant.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getProfil = async (req, res) => {
    try {
        const userId = req.user.userId;

        const student = await Student.findById(userId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Récupère la liste des enseignants des cours auxquels l'étudiant est inscrit.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */
exports.getListTeachers = async (req, res) => {
    const studentId = req.params.studentId;
    try{
        //tous les cours auxquels l'apprenant est inscrit
        const courses = await Course.find({ students: studentId});

        //extraire les enseignants de ces cours
        let listTeachers = [];

        for (const course of courses) {
            // Trouver le détail de l'enseignant pour chaque cours
            const teacher = await User.findById(course.teacher);
            // Vérifier si l'enseignant a été trouvé avec succès
            if (teacher) {
                // Vérifier si l'enseignant n'est pas déjà dans la liste
                if (!listTeachers.find(t => t._id.toString() === teacher._id.toString())) {
                    listTeachers.push(teacher);
                }
            }
        }        

        listTeachers = [...new Set(listTeachers)];
        //envoyer la liste des enseignants à l'apprenant
        res.status(200).json(listTeachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
/**
 * Récupère la liste des cours auxquels l'étudiant est inscrit.
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} res - L'objet de réponse HTTP.
 */ 
exports.getEnrolledCourses = async (req, res) => {
    try {
        // Récupérer l'ID de l'utilisateur à partir du jeton JWT
        const userId = req.user.userId; // Utilisez req.user.userId pour récupérer l'ID de l'utilisateur

        // Recherchez tous les cours où l'utilisateur est inscrit
        const courses = await Course.find({ students: userId });

        res.status(200).json(courses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*exports.signupStudent = async(req, res)=>{
    try{
        const { name, lastname, age, email, password, studentType, handicapTypes, role } = req.body;

        let existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ message: 'Student already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = new Student({
            name,
            lastname,
            age,
            email,
            password: hashedPassword,
            studentType,
            handicapTypes,
            role
        });

        await newStudent.save();

        res.status(201).json({ message: 'Student created successfully' });

    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error'});
    }
};

exports.loginStudent = async (req, res)=>{
    try {
        const { email, password } = req.body;

        const student = await Student.findOne({ email });
        if (!student) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: student._id }, 'your_secret_key', { expiresIn: '1h' });

        res.status(200).json({ token });

    } catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error'});
    }
};*/