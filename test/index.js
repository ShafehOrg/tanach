var expect = require("chai").expect;
var index = require("../index");

describe("Tanach", function () {
  describe("Sections", function () {
    it("returns sections", function () {
      var sections = index.sections;

      expect(sections).to.have.length(3);
    });

    it("returns Torah", function () {
      var torah = index.torah();

      expect(torah).to.equal('Torah');
    });

    it("returns Neviim", function () {
      var neviim = index.neviim();

      expect(neviim).to.equal('Neviim');
    });

    it("returns Kesuvim", function () {
      var kesuvim = index.kesuvim();

      expect(kesuvim).to.equal('Kesuvim');
    });
  });

  describe("Full text", function () {
    it("correctly parses json", function () {
      var torah1 = index.tanach("Bereishit", 1, 1);
      var torah2 = index.tanach("Shmuel I", 1, 1);

      expect(torah1[0].seferHe).to.equal('Bereishit');
      expect(torah1[0].seferEn).to.equal('Genesis');
      expect(torah2[0].txt).to.equal(' וַיְהִי֩ אִ֨ישׁ אֶחָ֜ד מִן־הָרָמָתַ֛יִם צוֹפִ֖ים מֵהַ֣ר אֶפְרָ֑יִם וּשְׁמ֡וֹ אֶ֠לְקָנָה בֶּן־יְרֹחָ֧ם בֶּן־אֱלִיה֛וּא בֶּן־תֹּ֥חוּ בֶן־צ֖וּף אֶפְרָתִֽי:');
    });
  });
});
