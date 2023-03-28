const Subs = require('../models/subs');

exports.uploadImage = async (req, res) => {
   try {
      console.log(req.params.subsName);
      console.log('머냐', req.file.filename);

      if (req.body.key === 'image') {
         console.log('test');
         await Subs.update(
            {
               imageUrn: req.file.filename,
            },
            { where: { name: req.params.subsName } },
         );
      } else {
         await Subs.update(
            {
               bannerUrn: req.file.filename,
            },
            { where: { name: req.params.subsName } },
         );
      }
      res.send('suess');
   } catch (error) {
      console.error(error);
   }
};

exports.uploadSubs = async (req, res) => {
   try {
      const subs = await Subs.create({
         name: req.body.name,
         title: req.body.title,
         description: req.body.description,
      });
      console.log(subs.name);
   } catch (error) {
      console.error(error);
   }
   res.send('success');
};
