import EssayFile from '../models/EssayFile';

class EssayFileController {

  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const essayFile = await EssayFile.create({
      name,
      path,
    })

    return res.json(essayFile);
  }
}

export default new EssayFileController();
