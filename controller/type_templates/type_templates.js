import express from "express";
import moment from "moment/moment.js";

import configureMiddleware from "./../../config/middleware.js";
import supabase from "./../../config/supabase.js";

import authenticateToken from "./../../helper/token.js";

const app = express();
configureMiddleware(app);
const router = express.Router();

router.post("/api/type-templates", authenticateToken, async (req, res) => {
  try {
    const { type, icon, nameClass } = req.body;

    const created_at = moment().format("YYYY-MM-DD HH:mm:ss");

    const { data: typeTemplate, error: insertError } = await supabase
      .from("type_templates")
      .insert({
        type: type,
        icon: icon,
        nameClass: nameClass,
        created_at: created_at,
        updated_at: created_at,
      })
      .select("*");

    if (insertError) {
      console.error("Insert error:", insertError);
      return res.status(500).json({
        success: false,
        message: insertError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Type has been added",
      data: typeTemplate,
    });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/api/type-templates", async (req, res) => {
  try {
    const { data: typeTemplates, error: selectError } = await supabase.from("type_templates").select("*");

    if (selectError) {
      console.error("Select error:", selectError);
      return res.status(500).json({
        success: false,
        message: selectError.message,
      });
    }

    return res.status(200).json({
      success: true,
      data: typeTemplates,
    });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get('/api/type-templates-id', async (req, res) => {
  const { id } = req.query;

  // Memastikan ID disediakan dan valid
  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required" });
  }

  try {
    // Ambil data dari Supabase berdasarkan ID
    const { data: item, error } = await supabase
      .from('type_templates')
      .select('*')
      .eq('type_template_id', id)
      .single();

    // Tangani kesalahan yang terjadi saat query ke Supabase
    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ success: false, message: "Database query error" });
    }

    // Jika data tidak ditemukan
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Mengembalikan data jika ditemukan
    return res.status(200).json({ success: true, data: item });

  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;
