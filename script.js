const form = document.getElementById("studentForm");

const success = document.getElementById("success");
const studentCode = document.getElementById("studentCode");

const registerBtn = document.getElementById("registerBtn");
const loading = document.getElementById("loadingOverlay");

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzI_DTPKzBEwzFeFkpolwFkhSvE4MA-70N0dmOhB-U_Qgyk-n1q6kWILPM_DstamSKnMw/exec";

let currentStudentName = "";

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    registerBtn.disabled = true;
    registerBtn.innerText = "جاري التسجيل...";

    loading.style.display = "flex";

    currentStudentName = document.getElementById("name").value;

    const data = {

        action: "register",

        name: currentStudentName,

        grade: document.getElementById("grade").value,

        parentPhone: document.getElementById("parentPhone").value,

        days: document.getElementById("days").value

    };

    try {

        const response = await fetch(SCRIPT_URL, {

            method: "POST",

            body: JSON.stringify(data),

            headers: {

                "Content-Type": "text/plain;charset=utf-8"

            }

        });

        const result = await response.json();

        loading.style.display = "none";

        if (result.success) {

            form.style.display = "none";

            success.style.display = "block";

            // الرسالة
            const title = success.querySelector("h2");

            if (result.alreadyExists) {

                title.innerHTML = "⚠️ بيانات الطالب مسجلة بالفعل";

            } else {

                title.innerHTML = "✅ تم تسجيل الطالب بنجاح";

            }

            // الكود
            studentCode.innerHTML = result.code;

            // QR
            const qrContainer = document.getElementById("qrcode");

            qrContainer.innerHTML = "";

            new QRCode(qrContainer, {

                text: String(result.code),

                width: 200,

                height: 200

            });

            registerBtn.innerText = "تم ✔";

        } else {

            registerBtn.disabled = false;

            registerBtn.innerText = "تسجيل";

            alert("حدث خطأ أثناء التسجيل.");

        }

    } catch (error) {

        console.error(error);

        loading.style.display = "none";

        registerBtn.disabled = false;

        registerBtn.innerText = "تسجيل";

        alert("تعذر الاتصال بالخادم.");

    }

});

// تحميل الـ QR
document.getElementById("downloadQR").addEventListener("click", function () {

    const qrContainer = document.getElementById("qrcode");

    const canvas = qrContainer.querySelector("canvas");

    if (!canvas) {

        alert("لم يتم إنشاء QR بعد.");

        return;

    }

    const link = document.createElement("a");

    link.download = `${currentStudentName}_QR.png`;

    link.href = canvas.toDataURL("image/png");

    link.click();

});