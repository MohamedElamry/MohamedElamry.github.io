Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

class Subject {
  constructor(name, arName, instructor1, instructor2, code) {
    this.name = name;
    this.arName = arName;
    this.instructors[0] = instructor1;
    this.instructors[1] = instructor2;
    this.id = code;
  }
  instructors = [];
  lectureNumber = 0;

  getTitle(instructorNo) {
    return `${this.arName} - المحاضره ${this.lectureNumber}/${instructorNo} - `;
  }

  getUrl(semester, instructorNo) {
    let ext = instructorNo === 1 ? `` : `_T${instructorNo}`;
    return `https://resources.zad-academy.com/Semester${semester}/${this.name}/Audios/Lecture${this.lectureNumber}_${this.name}_Semester${semester}${ext}.mp3`;
  }

  getLink(weekIndex) {
    return `https://lms-ar106.zad-academy.com/course/view.php?id=${
      this.id
    }#section-${2 + this.lectureNumber + weekIndex}`;
  }
}

const semester = 3;
let aqeedah = new Subject(
  "Aqeedah",
  "العقيدة",
  "د. أبو زيد بن محمد بن محمد مكي القبي",
  "د. عبدالله عمر سليمان الدميجي",
  34
);

let tafsir = new Subject(
  "Tafsir",
  "التفسير",
  "الشيخ محمد صالح المنجد",
  "د. قشمير بن محمد بن متعب القرني",
  35
);

let hadith = new Subject(
  "Hadith",
  "الحديث",
  "د. موفق بن عبد الله بن علي كدسة الغامدي",
  "د. عيسى المسملي: عيسى بن محمد بن عيسى المسملي",
  36
);

let seerah = new Subject(
  "Seerah",
  "السيره",
  "الشيخ عاصم الحكيم",
  "الشيخ حمزة بن ذاكر الزبيدي",
  37
);

let fiqh = new Subject(
  "Fiqh",
  "الفقه",
  "د.منصور بن عبد الرحمن الغامدي",
  "د. خالد بن عيد الجريسي",
  38
);

let tarbiyah = new Subject(
  "Tarbiyah",
  "التربية الإسلامية",
  "د. عبد العزيز بن حميد بن محمد الجهني",
  "الشيخ سعد بن عتيق العتيق",
  39
);

let arabic = new Subject(
  "Arabic",
  "اللغة العربية",
  "د. عبد الله بن محمد المسمليّ",
  "د. سليمان العيوني",
  40
);

let week = [
  [seerah, hadith, fiqh],
  [arabic, tafsir, aqeedah],
  [tarbiyah, hadith, fiqh],
  [arabic, seerah, aqeedah],
  [tarbiyah, tafsir, fiqh],
];

let times = [
  [17, 19, 20 + 45 / 60],
  [9, 9 + 40 / 60, 10 + 20 / 60],
  [12, 12 + 40 / 60, 13 + 20 / 60],
];

const weeks = 12;
const startDate = new Date("Sun, 29 Aug 2021 00:00:00 GMT+3");
let res = "";
let body = null;

if (typeof document !== "undefined") {
  body = document.getElementById("res-body");
}
for (let weekIndex = 0; weekIndex < weeks; weekIndex++) {
  week.forEach((day, dayIndex) => {
    day.forEach((lecture, lectureIndex) => {
      let lecNo = ++lecture.lectureNumber;
      let date = startDate
        .addDays(weekIndex * 7 + dayIndex)
        .addHours(times[semester - 1][lectureIndex])
        .toUTCString();
      lecture.instructors.forEach((instructor, instructorIndex) => {
        if (body) {
          let child = this.getLineHtml(
            date,
            instructor,
            lecture.getTitle(instructorIndex + 1),
            lecture.getUrl(semester, instructorIndex + 1),
            lecture.getLink(weekIndex)
          );
          body.appendChild(child);
        }
        res += getLineXml(
          date,
          instructor,
          lecture.getTitle(instructorIndex + 1),
          lecture.getUrl(semester, instructorIndex + 1),
          lecture.getLink(weekIndex)
        );
      });
    });
  });
}

console.log(res);

function getLineHtml(date, auth, title, url, link) {
  let child = document.createElement("tr");
  child.innerHTML = `
    <td>${date}</td>
    <td dir="rtl">${auth}</td>
    <td dir="rtl">${title}</td>
    <td>${url}</td>
    <td>${link}</td>`;
  return child;
}

function getLineXml(date, auth, title, url, link) {
  return `
    <item>
        <itunes:author>
${auth}
        </itunes:author>
        <title>
${title}
        </title>
        <itunes:summary>

        </itunes:summary>
        <description>

        </description>
        <enclosure url='${url}' length='40805972' type='audio/mpeg'/>
        <itunes:duration>00:45:00</itunes:duration>
        <guid isPermaLink='false'>${url}</guid>
        <pubDate>${date}</pubDate>
        <itunes:explicit>false</itunes:explicit>
        <link>${link}</link>
    </item>
`;
}
