"""
流浪宠物领养救助系统 - 数据库操作接口定义
作者：A（核心成员）
说明：B 和 C 请直接 import 本文件中的函数，不要自己写 SQL。
      所有函数当前为桩（返回假数据），后期由 A 统一替换为真实实现。
"""

from typing import List, Dict, Optional, Any

# ==================== 公共数据结构（类型提示，实际是字典） ====================
# User 对象
User = Dict[str, Any]   # 包含 user_id, account, username, role, created_at
# Pet 对象
Pet = Dict[str, Any]    # 包含 pet_id, name, species, age, gender, health_status,
                        # is_neutered, is_vaccinated, is_dewormed, image_url, status
# Application 对象
Application = Dict[str, Any]  # 包含 application_id, user_id, pet_id, reason,
                              # materials_url, status, admin_comment, created_at


# ==================== User 端接口（供 B 调用） ====================

def register(account: str, password: str, username: str) -> Dict[str, Any]:
    """
    用户注册
    返回: {"success": bool, "user_id": int, "message": str}
    """
    # TODO: A 后期实现真实数据库插入
    return {"success": True, "user_id": 1, "message": "注册成功"}


def login(account: str, password: str) -> Dict[str, Any]:
    """
    用户登录
    返回: {"success": bool, "user": User, "message": str}
    """
    # TODO: A 后期实现
    return {
        "success": True,
        "user": {
            "user_id": 1,
            "account": account,
            "username": "测试用户",
            "role": "user",
            "created_at": "2026-04-20"
        },
        "message": "登录成功"
    }


def get_pet_list(filters: Dict[str, Any] = None) -> List[Pet]:
    """
    查询宠物列表，支持筛选
    filters 示例: {"species": "布偶", "age_min": 0, "age_max": 12, "gender": "母"}
    传入空字典或 None 表示返回全部
    返回: List[Pet]
    """
    # TODO: A 后期实现真实筛选查询
    return [
        {
            "pet_id": 1,
            "name": "小花",
            "species": "布偶",
            "age": 6,
            "gender": "母",
            "health_status": "健康",
            "is_neutered": True,
            "is_vaccinated": True,
            "is_dewormed": True,
            "image_url": "https://example.com/pet1.jpg",
            "status": "可领养"
        },
        {
            "pet_id": 2,
            "name": "大橘",
            "species": "橘猫",
            "age": 12,
            "gender": "公",
            "health_status": "健康",
            "is_neutered": True,
            "is_vaccinated": False,
            "is_dewormed": True,
            "image_url": "https://example.com/pet2.jpg",
            "status": "可领养"
        }
    ]


def get_pet_detail(pet_id: int) -> Optional[Pet]:
    """
    获取单个宠物完整信息
    返回: Pet 对象，若不存在则返回 None
    """
    # TODO: A 后期实现
    if pet_id == 1:
        return {
            "pet_id": 1,
            "name": "小花",
            "species": "布偶",
            "age": 6,
            "gender": "母",
            "health_status": "健康",
            "is_neutered": True,
            "is_vaccinated": True,
            "is_dewormed": True,
            "image_url": "https://example.com/pet1.jpg",
            "status": "可领养"
        }
    return None


def submit_application(user_id: int, pet_id: int, reason: str, materials_file: Any) -> Dict[str, Any]:
    """
    提交领养申请，自动上传资质材料图片到 OSS
    materials_file: 文件对象（如上传的图片文件）
    返回: {"success": bool, "application_id": int, "message": str}
    """
    # TODO: A 后期实现（内部调用 upload_image）
    return {"success": True, "application_id": 101, "message": "申请提交成功"}


def get_my_applications(user_id: int) -> List[Application]:
    """
    获取当前用户的所有领养申请
    返回: List[Application]
    """
    # TODO: A 后期实现
    return [
        {
            "application_id": 101,
            "user_id": user_id,
            "pet_id": 1,
            "reason": "很喜欢猫",
            "materials_url": "https://example.com/material1.jpg",
            "status": "待审核",
            "admin_comment": "",
            "created_at": "2026-04-20"
        }
    ]


def sign_agreement(application_id: int) -> Dict[str, Any]:
    """
    签署协议（前提：申请状态为“通过”）
    调用后更新申请状态为“已签署”，对应宠物状态改为“已领养”
    返回: {"success": bool, "message": str}
    """
    # TODO: A 后期实现
    return {"success": True, "message": "签署成功"}


# ==================== Admin 端接口（供 C 调用） ====================

def admin_login(account: str, password: str) -> Dict[str, Any]:
    """
    管理员登录
    返回: {"success": bool, "admin_id": int, "message": str}
    """
    # TODO: A 后期实现
    return {"success": True, "admin_id": 100, "message": "登录成功"}


def add_pet(pet_info: Dict[str, Any], image_file: Any) -> Dict[str, Any]:
    """
    新增宠物
    pet_info: 不包含 pet_id 和 image_url 的字典，例如：
              {"name": "小白", "species": "田园猫", "age": 3, "gender": "母",
               "health_status": "健康", "is_neutered": False, ...}
    image_file: 宠物照片文件对象
    返回: {"success": bool, "pet_id": int, "message": str}
    """
    # TODO: A 后期实现（内部调用 upload_image）
    return {"success": True, "pet_id": 10, "message": "宠物添加成功"}


def update_pet(pet_id: int, pet_info: Dict[str, Any], image_file: Any = None) -> Dict[str, Any]:
    """
    修改宠物信息
    pet_info: 需要修改的字段字典，例如 {"name": "新名字", "age": 4}
    image_file: 可选，若提供则替换原图片
    返回: {"success": bool, "message": str}
    """
    # TODO: A 后期实现
    return {"success": True, "message": "更新成功"}


def delete_pet(pet_id: int) -> Dict[str, Any]:
    """
    删除宠物（需二次确认调用）
    返回: {"success": bool, "message": str}
    """
    # TODO: A 后期实现
    return {"success": True, "message": "删除成功"}


def get_pending_applications() -> List[Application]:
    """
    获取所有状态为“待审核”的领养申请
    返回: List[Application]
    """
    # TODO: A 后期实现
    return [
        {
            "application_id": 101,
            "user_id": 2,
            "pet_id": 1,
            "reason": "想养猫",
            "materials_url": "https://example.com/material1.jpg",
            "status": "待审核",
            "admin_comment": "",
            "created_at": "2026-04-20"
        }
    ]


def review_application(application_id: int, decision: str, comment: str) -> Dict[str, Any]:
    """
    审核领养申请
    decision: "approve" 或 "reject"
    comment: 审核意见（通过）或拒绝原因（拒绝）
    返回: {"success": bool, "message": str}
    """
    # TODO: A 后期实现
    return {"success": True, "message": f"已{ '通过' if decision == 'approve' else '拒绝' }"}


def get_all_pets() -> List[Pet]:
    """
    获取所有宠物（用于管理端列表展示）
    返回: List[Pet]
    """
    # TODO: A 后期实现
    return [
        {
            "pet_id": 1,
            "name": "小花",
            "species": "布偶",
            "age": 6,
            "gender": "母",
            "status": "可领养"
        },
        {
            "pet_id": 2,
            "name": "大橘",
            "species": "橘猫",
            "age": 12,
            "gender": "公",
            "status": "已领养"
        }
    ]


# ==================== 公共辅助接口 ====================

def upload_image(file: Any, folder: str) -> Dict[str, Any]:
    """
    上传图片到阿里云 OSS
    folder: 文件夹名称，如 "pets", "materials"
    返回: {"success": bool, "url": str, "message": str}
    """
    # TODO: A 后期实现 OSS 上传
    return {"success": True, "url": "https://example.com/uploaded.jpg", "message": "上传成功"}