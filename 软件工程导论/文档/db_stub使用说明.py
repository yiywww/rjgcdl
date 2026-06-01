# 在你的业务代码中
from db_stub import register, login, get_pet_list, submit_application, ...

# 示例：用户登录
result = login("zhangsan", "123456")
if result["success"]:
    user = result["user"]
    print(f"欢迎 {user['username']}")