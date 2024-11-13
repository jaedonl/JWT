export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { username: username }
        })

        if (!user) return res.status(404).json({ message: "Invlaid Credentials" })

        // Check if the pw is correct
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials" })

        // Generate cookie token and send to the user
        // res.setHeader("Set-Cookie", "test=" + "myValue").json("Success")

        const age = 1000 * 60 * 24 * 7;

        const token = jwt.sign({
            id: user.id
        }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        

        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            maxAge: age,
        }).status(200).json({message: "Login Successful"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to login" })
    }
}